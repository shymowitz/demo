import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { loginUser, isOrderActive } from '../../../shared/config';

@Component({
  selector: 'poc-modal',
  templateUrl: './poc-modal.component.html',
  styleUrls: ['./poc-modal.component.scss'],
})
/**
 * This is a generic modal intended for Delete/Place/Fulfill orders
 */
export class PocModal  {
   @Input('modal') myName: string='pocModal';
   // bind #childModal in this template to #deleteModal in parent template
   @ViewChild('childModal') pocModal: any;

   //copied from FinalizeOrderComponent
  placedOrder: any;
  placedIndex: number;
  orderCardType: string = 'ccorder';
  acceptTerms: boolean = false;
  pocDetails: any = {};
  selfPOC: boolean = false;
  searchText: string = '';
  searchedUsers = [];
  expDate: Date = new Date();
  finalOrders: any = [];
  mailDetails: any = {
        'name': '',
        'email': '',
        'rname': '',
        'remail': '',
        'message': ''
    };

   constructor( protected _dataService: DataService) {}
  
   ngOnInit() {
     
   }
   ngAfterViewInit() {
    
   }
   showModal(order: any, index: number) {
      try {
        this.setPlaceOrder(order, index);
        this.setSelfPOC();
        this[this.myName].show();
      } finally {

      }
  }

  // copied from FinalizeOrderComponent
  setPlaceOrder(order, index) {
     this.placedOrder = order;
     this.placedIndex = index;
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
            "contractHolderId": this.placedOrder.relationships.contractor.contractorIdf,
            "orderId": this.placedOrder.orderId,
            "pocId": this.pocDetails.userId,
            "orderType": this.orderCardType,
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
            self.finalOrders[self.placedIndex].placed = true;
            self.resetPOC();
        }, function (error) {
            self.resetPOC();
        });
    }
  closePOC() {
      this.resetPOC();
      this.cancel();
  }
  resetPOC() {
      this.acceptTerms = false;
      this.pocDetails = {};
      this.selfPOC = false;
      this.searchText = '';
      this.searchedUsers = [];
  }

  cancel() {
    this[this.myName].hide();
  }
  
}