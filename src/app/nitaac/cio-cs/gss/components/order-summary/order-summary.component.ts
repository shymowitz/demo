import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { FinalOrder } from '../../interfaces/final-order';
import { FinalOrderAddon } from '../../interfaces/final-order-addon';
import { addonsType } from '../../shared/addons-mapping';
import { MdSnackBar } from '@angular/material/snack-bar';
import { config } from '../../shared/config';
import * as globs from '../../shared/config';


@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {
  orders: any = [];
  viewedIndexes: any = [];
  totalAmount: number = 0;
  displayCharCount: number = 60;
  config: any = globs.config;
  addonsType: any = addonsType;
  filterCodes: any = globs.filterCodes;
  //config: any = this._commonService.getConfiguration();
  rfqLimit = this.config.rfqLimit;
  aboveRfqLimit: boolean = false;
  rfqLimitAlertDisplayed: boolean = false;
  showAddons: boolean = true;
  showAlert: boolean = false;
  orderSaved: boolean = false;
  gssFileSystemUrl = this._commonService.getGssFileSystemUrl();
  finalObjectI = {
    'clinId': '',
    'quantity': '0',
    'options': [],
    'customerId': '',
    'contractorId': '',
    'contractId': ''
  };

  constructor(private _commonService: CommonService, private _router: Router, private _dataService: DataService, private _snbar: MdSnackBar) { }

  ngOnInit() {
    this.orders = this._commonService.getOrders();
    if (this.orders.length > 0) {
      for (let order of this.orders) {
        order.quantity = order.quantity>0 ? order.quantity : 1;
        let total = order.attributes.discountedUnitPrice * order.quantity;
        for (let addon of order.addons) {
          total = total + (addon.discountedUnitPrice * addon.quantity);
        }
        order.orderAmount = total;
        this.aboveRfqLimit = (order.orderAmount > this.rfqLimit) ? true : false;
        this.updateAmount(total, true);
      }
    }

  }
//Add or Delete the quantity 
  updateQuantity(index, add) {
    if (this.orders[index].quantity <= 1 && !add) {
      return;
    }
    add ? this.orders[index].quantity++ : this.orders[index].quantity--;
    this.updateAmount(this.orders[index].attributes.discountedUnitPrice, add);
  }

    updateMultiQuantity(index, newQuantity) {
    this.updateAmount(this.orders[index].quantity*this.orders[index].attributes.discountedUnitPrice, false);
    this.orders[index].quantity = parseInt(newQuantity);
    this.updateAmount(this.orders[index].quantity*this.orders[index].attributes.discountedUnitPrice, true);
  }

    updateAddonQuantity(index, add, addonIndex) {
    if (this.orders[index].addons[addonIndex].quantity == 0 && !add) {
      return;
    }
    add ? this.orders[index].addons[addonIndex].quantity++ : this.orders[index].addons[addonIndex].quantity--;
    this.updateAmount(this.orders[index].addons[addonIndex].price, add);
  }

  updateAddonMultiQuantity(index, newQuantity, addonIndex) {
    this.updateAmount(this.orders[index].addons[addonIndex].quantity*this.orders[index].addons[addonIndex].price, false);
    this.orders[index].addons[addonIndex].quantity = parseInt(newQuantity);
    this.updateAmount(this.orders[index].addons[addonIndex].quantity*this.orders[index].addons[addonIndex].price, true);
  }

    updateAmount(amount, add) {
    this.totalAmount = add ? this.totalAmount + amount : this.totalAmount - amount;
    this.aboveRfqLimit = (this.totalAmount > this.rfqLimit) ? true : false;
    this.rfqLimitAlertDisplayed = false;
    this._commonService.resetOrders(this.orders);
  }
//End

  toggleAddons(index) {
    let extIndex = this.viewedIndexes.indexOf(index);
    (extIndex === -1) ? this.viewedIndexes.push(index) : this.viewedIndexes.splice(extIndex, 1);
  }

  viewAddons(index) {
    return (this.viewedIndexes.indexOf(index) === -1) ? false : true;
  }

  closeAlert() {
    this.showAlert = false;
  }

  //Save for Later 
  saveOrder() {
    let self = this;
    let finalProducts = this.getOrders(false);
    this._dataService.saveAndFinalizeOrder(finalProducts).subscribe(function (data) {
      self.orderSaved = data.error ? false : true;
      self._snbar.open('Saved!', '', { duration: 2000 });
    });
  }
  //End

  removeOrder(index) {
    this.updateAmount(this.orders[index].attributes.discountedUnitPrice*this.orders[index].quantity, false);
    this.orders.splice(index, 1);
    this._commonService.resetOrders(this.orders);
  }

  //Request JSON for checkout/savForLater 
  getOrders(checkout) {
    let finalProducts = { 'customerId': '', 'orders': [], 'oldOrderIds': [] };
    finalProducts.customerId = this.config.custId;

    for (let order of this.orders) {
      if (order.quantity > 0) {
        //Creating request format
        this.finalObjectI.clinId = order.attributes.clinIdf || this.config.clinId;//need to remove after service call('this.config.clinId')
        this.finalObjectI.quantity = order.quantity;
        this.finalObjectI.customerId = order.custId || this.config.customerId;//need to remove after service call('this.config.customerId')
        this.finalObjectI.contractorId = order.attributes.contractId;
        this.finalObjectI.contractId = order.attributes.contractId;

        if (order.addons.length > 0) {
          for (let addon of order.addons) {
            this.finalObjectI.options.push({ clinId: addon.id, quantity: addon.quantity });
          }
        }
        finalProducts.orders.push(this.finalObjectI);
      }
    }
    return finalProducts;
  }

  //End

  //Route to checkout
  finalizeOrder() {
    if (this.aboveRfqLimit && !this.rfqLimitAlertDisplayed) {
      this.showAlert = true;
      this.rfqLimitAlertDisplayed = true;
    } else {
       this._router.navigateByUrl('/checkout');
    }
  }
}
