import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { addonsType } from '../../shared/addons-mapping';
import { DataService } from '../../services/data.service';
import { loginUser, isOrderActive } from '../../shared/config';
import { Router, ActivatedRoute } from '@angular/router';
import { config } from '../../shared/config';
import * as globs from '../../shared/config';

@Component({
    selector: 'final-order',
    templateUrl: './finalize-order.component.html',
    styleUrls: ['finalize-order.component.scss']
})
export class FinalizeOrderComponent {
    finalOrders: any = [];
    checkoutData: any = [];
    contractProducts: any = [];
    orderDetails: any = [];
    viewedIndexes: any = [];
    searchedUsers: any = [];
    pocDetails: any = {};
    displayCharCount: number = 60;
    placedOrder: any = {};
    placedOrders: any = [];
    placedIndex: number;
    selfPOC: boolean = false;
    searchText: string = '';
    country: string = 'US';
    expDate: Date = new Date();
    addonsType: any = addonsType;
    acceptTerms: boolean = false;
    showAddons: boolean = true;
    config: any = globs.config;
    filterCodes: any = globs.filterCodes;
    mailDetails: any = {
        'name': '',
        'email': '',
        'rname': '',
        'remail': '',
        'message': ''
    };
    orderType: string = 'ccorder';
    //config: any = this._commonService.getConfiguration();
    orders: any = [];
    gssFileSystemUrl = this._commonService.getGssFileSystemUrl();

    constructor(private _commonService: CommonService, private _dataService: DataService) { }

    ngOnInit() {
        let self = this;
        this.orders = this._commonService.getOrders();
        if(this.orders.length<1) {
            return;
        }
        let checkoutRequest = this.getCheckoutRequest();
            this._dataService.saveAndFinalizeOrder({ 'customerId': this.config.custId,'oldOrderIds':[], 'orders': checkoutRequest }).subscribe(function (data) {
            if (data) {
                let contractorIds = Object.keys(data);
                for (let cntrId of contractorIds) {
                    let productAndContractor = self.getDetails(cntrId);
                    productAndContractor.orderId = data[cntrId];
                    self.finalOrders.push(productAndContractor);
                }
            }
        }, function (error) {
            console.log(error);
        });
    }

    getDetails(contractorId) {
        return this.checkoutData[contractorId];
    }
//Checkout request
    getCheckoutRequest() {
        let finalRequest = [];
        for (let order of this.orders) {
            let options = [];
            if (order.quantity > 0) {
                //Creating request format
                let reqObj = {
                    clinId: order.attributes.nitaacClin || this.config.clinId,//need to remove after service call('this.config.clinId')
                    quantity: order.quantity,
                    customerId: order.custId || this.config.customerId,//need to remove after service call('this.config.customerId')
                    contractorId: order.attributes.contractId,
                    contractId: order.attributes.contractId
                };

                if (order.addons.length > 0) {
                    for (let addon of order.addons) {
                        options.push({ clinId: addon.id, quantity: addon.quantity });
                    }
                }
                finalRequest.push(reqObj);

                if (this.checkoutData[order.attributes.contractId]) {
                this.checkoutData[order.attributes.contractId].products.push(order);
                this.checkoutData[order.attributes.contractId].totalAmount = this.checkoutData[order.attributes.contractId].totalAmount + this.getCheckoutTotal(order);
                this.contractProducts[order.attributes.contractId].push(order.attributes.nitaacClin);
            }
            else {
                this.checkoutData[order.attributes.contractId] = {
                    contractorDetails: order.relationships.contractor,
                    products: [order],
                    totalAmount: this.getCheckoutTotal(order),
                    orderId: 0
                };
                this.contractProducts[order.attributes.contractId] = [];
                this.contractProducts[order.attributes.contractId].push(order.attributes.nitaacClin);
            }
            console.log(this.contractProducts);
            }
        }
        return finalRequest;
    }

    //End

    //Total price for checkout 
    getCheckoutTotal(product) {
        let total = 0;
        console.log('test');
        console.log(product.attributes);
        total = total + (product.attributes.price * product.quantity);
        for (let option of product.addons) {
            total = option.quantity > 0 ? total + (option.price * option.quantity) : total;
        }
        return total;
    }

    //End

    removeOrder(index) {
        //need clarification for service call on deletion.
        this.finalOrders.splice(index, 1);
        sessionStorage.setItem('checkoutData', JSON.stringify({ 'checkOrders': this.finalOrders }));
    }

    viewDetails(order) {
        this.orderDetails = order;
        console.log('test');
        console.log(this.orderDetails);//check for the json structure
    }

    setPlaceOrder(order, index) {
        this.placedOrder = order;
        this.placedIndex = index;
    }

    //Create RFQ
    createRFQ() {
        this.finalOrders[this.placedIndex].rfqRequested = true;       
        this.removeFromSummary(this.placedOrder.contractorDetails.attributes.idf);
    }
    //End

    viewAddons(index) {
        return (this.viewedIndexes.indexOf(index) === -1) ? false : true;
    }

    toggleAddons(index) {
        let extIndex = this.viewedIndexes.indexOf(index);
        (extIndex === -1) ? this.viewedIndexes.push(index) : this.viewedIndexes.splice(extIndex, 1);
    }
    //User search
    searchUser(data) {
        let self = this;
        if (data.length > 2) {
            this._dataService.searchUser(data, loginUser.orgId).subscribe(function (res) {
                self.searchedUsers = res;
            });
        } else {
            this.searchedUsers = [];
        }
    }
    //End

    //Email to do...
    sendMail() {
        console.log(this.mailDetails);
    }

    selectUser(user) {
        this.pocDetails = user;
        this.searchedUsers = [];
    }

    setSelfPOC() {
        this.selfPOC = !this.selfPOC;
        this.searchText = '';
        this.searchedUsers = [];
        this.pocDetails = this.selfPOC ? loginUser : {};

    }
    //place order
    //need to remove once login authentication is implemented
    placeOrder() {
        let self = this;
        let params = {
            "contractHolderId": this.placedOrder.contractorDetails.attributes.idf,
            "orderId": this.placedOrder.orderId,
            "pocId": this.pocDetails.userId,
            "orderType": this.orderType,
            "price": this.placedOrder.totalAmount,
            "gssshippingAddress": {
                "streetOne": this.pocDetails.address.street1,
                "streetTwo": this.pocDetails.address.street2,
                "streetThree": this.pocDetails.address.street3,
                "city": this.pocDetails.address.city,
                "stateCode": this.pocDetails.address.state,
                "zipPostalCode": this.pocDetails.address.zip
            },
            "expectedDate": this.expDate
        };
        this._dataService.placeOrder(params).subscribe(function (res) {
            self.removeFromSummary(self.placedOrder.contractorDetails.attributes.idf);
            self.finalOrders[self.placedIndex].placed = true;
            self.resetPOC();
        }, function (error) {
            self.resetPOC();
        });
    }

    //Remove products from order summary
    removeFromSummary(id) {
        let removedIndexes = [];
        for (let i = 0; i < this.orders.length; i++) {
            if (this.contractProducts[id].indexOf(this.orders[i].attributes.nitaacClin) !== -1) {
                removedIndexes.push(i);
            }
        }
        removedIndexes.sort().reverse();
        for (let index of removedIndexes) {
            this.orders.splice(index, 1);
        }
        this._commonService.resetOrders(this.orders);
    }

    //End

    closePOC() {
        this.resetPOC();
    }
    resetPOC() {
        this.acceptTerms = false;
        this.pocDetails = {};
        this.selfPOC = false;
        this.searchText = '';
        this.searchedUsers = [];
    }

}