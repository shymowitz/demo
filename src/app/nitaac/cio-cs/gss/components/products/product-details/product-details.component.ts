import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { addonsType } from '../../../shared/addons-mapping';
import { environment } from '../../../../../../../environments/environment';
import { config } from '../../../shared/config';
import * as globs from '../../../shared/config';
import { CompareProductComponent } from '../../../components/compare-product/compare-product.component';


@Component({
  selector: 'product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  public images = [];
  productId: string = '';
  productDetails: any = {};
  displayCharCount: number = 60;
  addons: any = [];
  count: number = 0;
  totalAmount: number = 0.0;
  canCompare: boolean = true;
  comparedIds: number[] = [];
  //showProductAdded: boolean = false;
  config: any = globs.config;
  filterCodes: any = globs.filterCodes;
  addonsType: any = addonsType;
  //config: any = this._commonService.getConfiguration();
  OMBRestrict = this.config.OMBRestrict;
  ele: any;
  gssFileSystemUrl = this._commonService.getGssFileSystemUrl();
  public contractorClinID: String = '';

  @ViewChild(CompareProductComponent) _compareProductComponent: CompareProductComponent;

  constructor(private _dataService: DataService, private _location: Location, private _commonService: CommonService, private _activatedRoute: ActivatedRoute, private _router: Router) {
    this._commonService.resetCompareCalled.subscribe(data => this.comparedIds = data, error => console.log(error));
  }


  ngOnInit() {
    let self = this;
    this.comparedIds = this._commonService.getComparedProducts();
    this._activatedRoute.params.subscribe(params => {
      this.productId = params['clinId'];
      this._dataService.getProductDetails(this.productId).subscribe(res => {
        self.productDetails = res.data[0]; //need to remove '[0]' after backend data issue resolved
        self.productDetails.quantity = 1;
        self.contractorClinID = self.productDetails.attributes.contractorClinId;

        for (let i = 1; i < 4; i++) {
          let img = environment.gssFileSystemUrl + "/" + self.contractorClinID + "/" + self.contractorClinID + "-" + i + ".png";
          if (img) {
            self.images.push(img);
          }
        }

        self.updateAmount(self.productDetails.attributes.price, true);
        for (let option of self.productDetails.relationships.contractor.options) {
          option.quantity = self.count;
        }
      });
    }, error => console.log(error));

  }
  //Add or Delete the quantity 
  updateQuantity(add) {
    if (this.productDetails.quantity <= 1 && !add) {
      return;
    }
    add ? this.productDetails.quantity++ : this.productDetails.quantity--;
    this.updateAmount(this.productDetails.attributes.discountedUnitPrice, add);
  }

  updateMultiQuantity(newQuantity) {
    this.updateAmount(this.productDetails.quantity*this.productDetails.attributes.discountedUnitPrice, false);
    this.productDetails.quantity = (newQuantity.length>0)?newQuantity:'0';
    this.productDetails.quantity = parseInt(this.productDetails.quantity);
    this.updateAmount(this.productDetails.quantity*this.productDetails.attributes.discountedUnitPrice, true);
  }

    updateAddonQuantity(index, add) {
    if (this.productDetails.relationships.contractor.options[index].quantity == 0 && !add) {
      return;
    }
    add ? this.productDetails.relationships.contractor.options[index].quantity++ : this.productDetails.relationships.contractor.options[index].quantity--;
    this.updateAmount(this.productDetails.relationships.contractor.options[index].price, add);
  }

    updateAddonMultiQuantity(newQuantity, index) {
    this.updateAmount(this.productDetails.relationships.contractor.options[index].quantity*this.productDetails.relationships.contractor.options[index].price, false);
    this.productDetails.relationships.contractor.options[index].quantity = parseInt(newQuantity);
    this.updateAmount(this.productDetails.relationships.contractor.options[index].quantity*this.productDetails.relationships.contractor.options[index].price, true);
  }

  updateAmount(amount, add) {
    this.totalAmount = add ? this.totalAmount + amount : this.totalAmount - amount;
  }

  addToOrder() {
    let orders = this.productDetails;
    orders.addons = [];
    for (let option of this.productDetails.relationships.contractor.options) {
      (option.quantity > 0) ? orders.addons.push(option) : '';
    }
    this._commonService.setOrders(orders);
  }

  goBack() {
    this._location.back();
  }

  //Code to Compare
  addToCompare(product, ele) {
    this.ele = ele;
     this._compareProductComponent.addToCompare(product);
  }

  disableRemaining(products) {
    this.ele.checked = false;
    this.canCompare = false;
    this.comparedIds = products;
  }

  enableAll(products) {
    this.canCompare = true;
    this.comparedIds = products;
  }

  isDisable(clinId) {
    if (!this.canCompare) {
      return (this.comparedIds.indexOf(clinId) !== -1) ? false : true;
    } else {
      return false;
    }
  }
  //End

  //OMB
  checkOmb(configCode) {
    return (this.OMBRestrict.indexOf(configCode) === -1) ? true : false;
  }
  //end
}

//  imageURL: string = this.gssFileSystemUrl/this.productDetails.attributes.contractorClinId/this.productDetails.attributes.contractorClinId-1.png;

// var IMAGES: Image[] = [
//   { "title": "", "url": "https://s3.amazonaws.com/neos-xapps-dev-s3bucketforwebsitecontent-1n4lc2awh3ps4/GSS-product-images-updated" + this.contractorClinID + "/" + this.contractorClinID + "-1.png" },
//   { "title": "", "url": "https://s3.amazonaws.com/neos-xapps-dev-s3bucketforwebsitecontent-1n4lc2awh3ps4/GSS-product-images-updated/GSS-D1-2-0046W-0/GSS-D1-2-0046W-0-2.png" },
//   { "title": "", "url": "https://s3.amazonaws.com/neos-xapps-dev-s3bucketforwebsitecontent-1n4lc2awh3ps4/GSS-product-images-updated/GSS-D1-2-0046W-0/GSS-D1-2-0046W-0-3.png" },
//   { "title": "", "url": "https://s3.amazonaws.com/neos-xapps-dev-s3bucketforwebsitecontent-1n4lc2awh3ps4/GSS-product-images-updated/GSS-D1-2-0046W-0/GSS-D1-2-0046W-0-4.png" }
// ];

// src='{{gssFileSystemUrl}}/{{contractor.contractorClinId}}/{{contractor.contractorClinId}}-1.png'
