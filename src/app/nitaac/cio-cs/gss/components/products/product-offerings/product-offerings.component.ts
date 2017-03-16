import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { GlobalService } from '../../../services/global.service';
import { config } from '../../../shared/config';
import * as globs from '../../../shared/config';
import { CompareProductComponent } from '../../../components/compare-product/compare-product.component';


@Component({
    selector: 'product-offerings',
    templateUrl: 'product-offerings.component.html',
    styleUrls: ['product-offerings.component.scss']
})
export class OfferingsComponent {
    id: number;
    products: any = [];
    displayCharCount: number = 60;
    config: any = globs.config;
    filterCodes: any = globs.filterCodes;
    ele: any;
    openindexes: any = [];
    offeringProduct: any = {};
    comparedProducts: any = [];
    canCompare: boolean = true;
    comparedIds: any = [];
    OMBRestrict = config.OMBRestrict;
    gssFileSystemUrl = this._commonService.getGssFileSystemUrl();
    
    @ViewChild(CompareProductComponent) _compareProductComponent: CompareProductComponent;

    constructor(private _activatedRoute: ActivatedRoute, private _commonService: CommonService, private _globalService: GlobalService) {
        this._commonService.resetCompareCalled.subscribe(data => this.comparedIds = data, error => console.log(error));
    }


    ngOnInit() {
        this.comparedIds = this._commonService.getComparedProducts();
        this._activatedRoute.params.subscribe(params => {
            this.id = params['id'];
            this.offeringProduct = this.getOfferings(params['id']);

            //For sorting products based on price
            this.offeringProduct.relationships.contractors = this._globalService.getSortedByPrice(this.offeringProduct.relationships.contractors);
        }, error => console.log(error));
    }

    getOfferings(id) {
        this.products = this._commonService.getAllProducts();
        if (this.products.length > 0) {
            for (let product of this.products) {
                if (product.productId == id) {
                    return product;
                }
            }
        }
        else {
            return this.products;
        }
    }

    //Code to Compare
    addToCompare(productId, ele) {
        this.ele = ele;
        this._compareProductComponent.addToCompare(productId);
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

    isDisable(product) {
        if (!this.canCompare) {
            return (this.comparedIds.indexOf(product.clinIdf) !== -1) ? false : true;
        } else {
            return false;
        }
    }


    //End
    //OMB
    checkOmb(configCode) {
        return (this.OMBRestrict.indexOf(configCode) === -1) ? true : false;
    }
    //End

}