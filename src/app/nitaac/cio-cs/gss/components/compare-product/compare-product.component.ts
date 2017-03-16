import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { MdSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../services/data.service';
import { addonsType } from '../../shared/addons-mapping';
import { config } from '../../shared/config';
import * as globs from '../../shared/config';


@Component({
  selector: 'compare-product',
  templateUrl: './compare-product.component.html',
  styleUrls: ['./compare-product.component.scss']
})
export class CompareProductComponent implements OnInit {
  ngOnInit() {
  }
  products: any = [];
  productDetails: any;
  addonsType: any = addonsType;
  addonsKeys: any = [];
  showProducts: boolean = false;
  properties: any = [{ 'label': 'OS', 'key': 'osSpecs' }, { 'label': 'Ram', 'key': 'ramSpecs' }, { 'label': 'Hard Drive', 'key': 'hardDriveSpecs' }, { 'label': 'Graphics', 'key': 'graphicSpecs' }, { 'label': 'Optional Drive', 'key': 'opticalDriveSpecs' }, { 'label': 'Display', 'key': 'displaySize' }, { 'label': 'Sound', 'key': 'soundSpecs' }, { 'label': 'Speaker', 'key': 'speakerSpecs' }, { 'label': 'Keyboard', 'key': 'keyboardSpecs' }, { 'label': 'Webcam', 'key': 'webcamSpecs' }, { 'label': 'Microphone', 'key': 'microphoneSpecs' }, { 'label': 'Bluetooth', 'key': 'bluetoothSpecs' }, { 'label': 'Smart Card', 'key': 'smartCardReaderSpecs' }, { 'label': 'Network', 'key': 'networkInterfaceSpecs' }, { 'label': 'Ports', 'key': 'portSpecs' }, { 'label': 'Expansion Slots', 'key': 'expansionSlots' }, { 'label': 'Delivery Time', 'key': 'deliveryTime' }, { 'label': 'Weight', 'key': 'weight' }, { 'label': 'Platform Integrity', 'key': 'platformIntegritySpecs' }];

  productProperties: any = [];
  addonsProperties: any = [];
  filterCodes: any = globs.filterCodes;
  config: any = globs.config;
  //config: any = this._commonService.getConfiguration();
  gssFileSystemUrl = this._commonService.getGssFileSystemUrl();

  @Output() disableRemaining = new EventEmitter();
  @Output() enableAll = new EventEmitter();

  constructor(private _commonService: CommonService, private _dataService: DataService, private _snackBar: MdSnackBar, private _router: Router) {
    this.products = this._commonService.getComparedProducts();
  }

  addToCompare(productId) {
    this.products = this._commonService.getComparedProducts();
    let index = this.products.indexOf(productId);
    if (index != -1) {
      this.products.splice(index, 1);
      this.enableAll.emit(this.products);
    } else {
      if (this.products.length < 3) {
        this.products.push(productId);
      } else if (this.products.length === 3) {
        this.showsnBar();
        //this.disableRemaining.emit(this.products);
      } else {
        this.showsnBar();
      }
    }
    this._commonService.setCompareProducts(this.products);
  }

  showsnBar() {
    this._snackBar.open('Compare products limit(max 3) reached.', 'close');
  }

  viewComparision() {
    let self = this;
    this.addonsKeys = Object.keys(addonsType);
    this.products = this._commonService.getComparedProducts();
    this._dataService.getComparedProducts(this.products).subscribe(data => {
      if (data) {
        self.getAddons(data.data);
        self.productDetails = data.data;
        self.setCompareData(self.productDetails);
        self.showProducts = true;
      }
    }, error => { });
  }

  setCompareData(products) {
    this.productProperties = [];
    this.addonsProperties = [];

    for (let property of this.properties) {
      this.productProperties.push({
        'label': property.label,
        'product1': (this.productDetails[0] && this.productDetails[0].attributes[property.key]) || '',
        'product2': (this.productDetails[1] && this.productDetails[1].attributes[property.key]) || '',
        'product3': (this.productDetails[2] && this.productDetails[2].attributes[property.key]) || ''
      });
    }

    let productAddons = [];
    for (let product of products) {
      let addons = [];
      for (let option of product.relationships.contractor.options) {
        addons.push(option.configurationTypeCode);
      }
      productAddons.push({
        'id': product.attributes.nitaacClin,
        'addons': addons
      });
    }

    for (let key of this.addonsKeys) {
      this.addonsProperties.push({
        'label': this.addonsType[key],
        'product1': ((productAddons[0]) && ((productAddons[0].addons.indexOf(key) === -1) ? 'No' : 'Yes')) || '',
        'product2': ((productAddons[1]) && ((productAddons[1].addons.indexOf(key) === -1) ? 'No' : 'Yes')) || '',
        'product3': ((productAddons[2]) && ((productAddons[2].addons.indexOf(key) === -1) ? 'No' : 'Yes')) || ''
      })
    }

  }

  deleteCompare(product, index) {
    this.productDetails.splice(index, 1);
    this.setCompareData(this.productDetails);
    this.products.splice(this.products.indexOf(product.attributes.nitaacClin), 1);
    this._commonService.setCompareProducts(this.products);
  }

  getAddons(products) {
    for (let product of products) {
      product.addons = [];
      for (let option of product.relationships.contractor.options) {
        product.addons.push(this.addonsType[option.configurationTypeCode]);
      }
    }
  }

  checkExist(key, checkList) {
    return (checkList.indexOf(key) !== -1) ? 'Yes' : 'No';
  }
}
