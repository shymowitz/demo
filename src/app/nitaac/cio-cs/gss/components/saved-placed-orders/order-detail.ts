import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { addonsType } from '../../shared/addons-mapping';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/merge';

@Component({
  selector: 'app-order-detail',
  templateUrl: './placed-order-detail.html',
  styleUrls: ['./placed-order-detail.scss']
})

/** 
 */
export class SavedPlacedOrderDetail implements OnInit {
  orders: any = [];
  totalAmount: number = 0;
  checkoutData: any = [];
  displayCharCount: number = 60;
  addonsType: any = addonsType;
  config: any = this._commonService.getConfiguration();
  rfqLimit = this.config.rfqLimit;
  aboveRfqLimit: boolean = false;
  rfqLimitAlertDisplayed: boolean = false;
  showAlert: boolean = false;
  orderSaved: boolean = false;
  finalObjectI = {
    'clinId': '',
    'quantity': '0',
    'options': [],
    'customerId': '',
    'oldOrderIds':'',
    'contractorId': ''
  };

  order: any;
  // userType: string = null;
  orderType: string = null;
  orderLabel: string = '';
  orderHeadingLabel: string = '';
   
  customerName: string = '';
  customerEmail: string = '';
  customerOrgName: string = '';
  customerShippingAddress: string = '';
  expectedDeliveryDate: string = '';

  onLoading = true;
  orderId: string = '';
  orderNameCode: string = '';
  showAddons: false;
  constructor(private location: Location, private _commonService: CommonService, private _router: Router, private route: ActivatedRoute, private _dataService: DataService) { 

  }
  /**
   * Get route parameter orderId
   */
  ngOnInit() {
    // merge parameter and/or query parameters
    Observable.merge(
      this.route.params.map(params => this.handleParams(params)),
      this.route.queryParams.map(queryParams => this.handleQueryParams(queryParams))
    )
      .subscribe(
      () => this.onParamsOrQueryParamsChange()
      );
  }

  handleParams(params) {
    console.log('params', params);
    this.orderId = params['orderId'];
  }
  handleQueryParams(params) {
     console.log('query params', params);
     // type used for the page label 
     if (params['type']) {
        this.orderType = params['type'];
        if (this.orderType === 's') {
            this.orderLabel = 'Saved Order';
        } else if (this.orderType === 'p') {
            this.orderLabel = 'Placed Order';
        }
     }
    //  if (params['user']) {
    //      this.userType = params['user'].toUpperCase();
    //  }

  }

  onParamsOrQueryParamsChange() {
     if ( this.orderType )
         this.getOrderById();

  }

  updateQuantity(item, change, orderAmount) {
    if (this.orders[item].quantity == 1 && !change) {
      return;
    }
    let updateAmount = this.orders[item].discountedUnitPrice || this.orders[item].attributes.discountedUnitPrice;
    if (change) {
      orderAmount = orderAmount + updateAmount;
      this.orders[item].quantity++;
    } else {
      orderAmount = orderAmount - updateAmount;
      this.orders[item].quantity--;
    }
    this.aboveRfqLimit = (orderAmount > this.rfqLimit) ? true : false;
    this.rfqLimitAlertDisplayed = false;
    this.getTotal(updateAmount, change);
    this._commonService.resetOrders(this.orders);
  }

  getTotal(amnt, add, quantity = 1) {
    this.totalAmount = add ? this.totalAmount + (amnt * quantity) : this.totalAmount - amnt;
  }

  /**
   * toggleAddons(index)
   * Toggle View Addons link
   */
  toggleAddons(index) {
    let id = 'order'+index;
    this[id] = !this[id];
  }
  /**
   * Let UI to display View Addons modal
   */
  viewAddons(index) {
    return this['order'+index];
  }

  closeAlert() {
    this.showAlert = false;
  }
  //Checkout
  finalizeOrder() {
    let self = this;
    if (this.aboveRfqLimit && !this.rfqLimitAlertDisplayed) {
      this.showAlert = true;
      this.rfqLimitAlertDisplayed = true;
    } else {
      console.log('finalizeOrder finalProducts')
      let finalProducts = this.getOrders(true);
      this._dataService.saveAndFinalizeOrder(finalProducts).subscribe(function (data) {
        if (data) {
          for (let order in self.checkoutData) {
            if (self.checkoutData.hasOwnProperty(order)) {
              self.checkoutData[order].orderId = data[order];
            }
          }
          self._commonService.setCheckoutData(self.checkoutData);
          self._router.navigateByUrl('/checkout');
        }
      }, function (error) {
        console.log(error);
      });
    }


  }

  removeOrder(index) {
    this.orders.splice(index, 1);
    this._commonService.resetOrders(this.orders);
  }

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
        // this.finalObjectI.oldOrderIds = order.oldOrderIds;

        if (order.addons.length > 0) {
          for (let addon of order.addons) {
            this.finalObjectI.options.push({ clinId: addon.id, quantity: addon.quantity });
          }
        }
        finalProducts.orders.push(this.finalObjectI);

        //Creating checkoutData
        if (checkout) {
          if (this.checkoutData[order.attributes.contractId]) {
            this.checkoutData[order.attributes.contractId].contractorDetails = order.relationships.contractor;
            this.checkoutData[order.attributes.contractId].products.push(order);
            this.checkoutData[order.attributes.contractId].totalAmount = this.checkoutData[order.attributes.contractId].totalAmount + this.getCheckoutTotal(order);
          }
          else {
            this.checkoutData[order.attributes.contractId] = {
              contractorDetails: order.relationships.contractor,
              products: [order],
              totalAmount: this.getCheckoutTotal(order),
              orderId: 0
            };
          }
        }
        //End
      }
    }

    return finalProducts;
  }

  getCheckoutTotal(product) {
    let total = 0;
    total = total + (product.attributes.price * product.quantity);
    for (let option of product.addons) {
      total = option.quantity > 0 ? total + (option.price * option.quantity) : total;
    }
    return total;
  }

  back() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  /** 
   * getOrderById()
   * Get order from backend API based on orderId
   */
  getOrderById() {
    let request = {
      orderId: this.orderId
    };
    this._dataService.placedOrderDetails(request).subscribe(res => {
      this.customerInfo(res);
      this.orders = res.baseProducts;
      console.log('orders[0]', this.orders[0]);
      this.setMetaData(this.orders);
      this.onLoading = false;
      for (let order of this.orders) {
          let total = order.data[0].relationships.contractor.baseProductPrice;
          for (let addon of this.getOptions(order)) {
            total = total + (addon.catalogUnitPrice * addon.quantity);
          }
          order.orderAmount = total;
          this.aboveRfqLimit = (order.orderAmount > this.rfqLimit) ? true : false;
          this.getTotal(total, true);
      }
    }, error => console.log(error));
  }

  setMetaData(orders) {
    for (let order of orders) {
        order['attributes'] = order.data[0].attributes;
        order['relationships'] = order.data[0].relationships;
        order['image'] = this.getImage(order);
        order['addons'] = this.getOptions(order);
        let total = order.attributes.discountedUnitPrice;
        order['quantity'] = order['quantity'] || 1;
        for (let addon of order.addons) {
          total = total + (addon.discountedUnitPrice * addon.quantity);
        }
        order.orderAmount = total;
        this.aboveRfqLimit = (order.orderAmount > this.rfqLimit) ? true : false;
        this.getTotal(total, true, order.quantity);
   }
  }

  /** 
   * customerInfo(order)
   * Compose customer info for UI
   */
  customerInfo(order) {
    this.orderNameCode = order.orderNameCode;
    if (this.orderType != 's') {
       this.orderHeadingLabel = 'Order# ' + order.orderNameCode;
    } else {
       let date = new Date(order.createdDate).toLocaleDateString("en-US");
       this.orderHeadingLabel = 'Saved Order ' + date;
    }
    this.customerName = order.customerName;
    this.customerEmail = order.customerEmail;
    this.customerOrgName = order.customerOrgName;
    this.expectedDeliveryDate = order.expectedDeliveryDate;

    if (!this.expectedDeliveryDate || this.expectedDeliveryDate.length === 0) {
      let future = new Date();
      future.setTime(future.getTime() + 30 * 24 * 60 * 60 * 1000);
      this.expectedDeliveryDate = future.toLocaleDateString("en-US");
    }
    if (order.addressName) {
      this.customerShippingAddress += order.addressName;
    }
    if (order.streetOne && order.streetOne != '') {
      this.customerShippingAddress += ' ' + order.streetOne;
    }
    if (order.streetTwo && order.streetTwo != '') {
      this.customerShippingAddress += ' ' + order.streetTwo;
    }
    if (order.streetThree && order.streetThree != '') {
      this.customerShippingAddress += ' ' + order.streetThree;
    }
    if (order.state && order.state != '') {
      this.customerShippingAddress += ', ' + order.state;
    }
    if (order.zipcode && order.zipcode != '') {
      this.customerShippingAddress += ' ' + order.zipcode;
    }
  }
  /**
   * getContractor(order)
   * Get contractor name from json 
   */
  getContractor(order) {
    return order.attributes.contractorName
  }
  /**
   * getDeliveryTime
   * Get delivery time from json
   */
  getDeliveryTime(order) {
    return order.attributes.deliveryTime
  }
  /**
   * getOemPartNum(order)
   * Gte OEM Part Num from json
   */
  getOemPartNum(order) {
    return order.attributes.oemPartNum
  }
  /**
   * getItemSpec(order) {
   * Get Item Specs from json
   */
  getItemSpec(order) {
    return order.attributes.itemSpecifications;
  }

  getImage(order): string {
     let gssFileSystemUrl = this._commonService.getGssFileSystemUrl();
     let url = gssFileSystemUrl+"/"+ order.attributes.contractorClinId+
            "/"+order.attributes.contractorClinId+"-1.png";
     return url;
    // let url = order.data[0].attributes.imageUrl;
    // if (/^http/.test(url)) {
    //   return url;
    // } else {
    //   console.log('invalid image url', url);
    //   return this.config.defaultImage;
    // }
  }

  /**
   * getOptions(prod: any)
   * Get all product options
   */
  getOptions(prod: any): Array<any> {
    return prod.relationships.contractor.options.filter(opt => opt.quantity > 0);
  }
 
  footer() {
    let userType = CommonService.userInfo.userType;
    let type = '';
    if (userType==='CONTRACTOR') {
      if (this.orderType === 's' )
         type = 'contractor_save';
      else  if (this.orderType === 'p' )
         type = 'contractor_place';
    } else if (userType==='CUSTOMER') {
      if (this.orderType === 's' )
         type = 'customer_save';
      else  if (this.orderType === 'p' )
         type = 'customer_place';
    } else if (userType==='NITAAC') {
      if (this.orderType === 's' )
         type = 'admin_save';
      else  if (this.orderType === 'p' )
         type = 'admin_place';
    }
    return type;
  }

}
