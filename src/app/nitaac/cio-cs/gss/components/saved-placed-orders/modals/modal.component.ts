import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'my-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
/**
 * This is a generic modal intended for Delete/Place/Fulfill orders
 */
export class MyModal  {
   @Input('modal') myName: string='deleteModal';
   @Input('size') size: string='sm';

   // bind #childModal in this template to #deleteModal in parent template
   @ViewChild('childModal') deleteModal: any;
   @ViewChild('childModal') infoModal: any;

   constructor( protected _dataService: DataService) {}
   order: any;
   confirmLabel: string = 'Confirm';
   title: string = '';
   message: string = '';
   
   ngOnInit() {
      if (this.myName === 'infoModal') {
         this.confirmLabel = 'OK';
         this.title = 'Attention!'
         this.message = 'This is a credit card order. You must contact the customer to receive payment, before fulfilling the order';
      } else {
      }
   }
   ngAfterViewInit() {
     if (this.myName === 'infoModal') {
         this.infoModal.show();
     }
   }

   /**
    * Called from Order List template
    * action = 'delete' 
    */
   showModal(order: any) {
     console.log('showModal',order)

      try {
          if (this.myName === 'deleteModal') {
             let id = order.orderId || order.attributes.id
             this.order = order;
             this.title = 'Delete Order'
             this.message = 'Are you  sure yo want to delete Order with ID ' + id 
             if (order.attributes && order.attributes.oemPartNum)
                this.message += ' Manufacture Part Number: ' + order.attributes.oemPartNum 
                
             this.message += '?';
             this.deleteModal.show();
          }
      } finally {

      }
  }
  cancel() {
    if (this.order) {
       this.order = null;
    }
    this[this.myName].hide();
  }
  confirm() {
    if (this.myName === 'deleteModal') {
       this.deleteOrder();
     } else if (this.myName === 'infoModal') {
       this.cancel();
     }
  }
  deleteOrder() {
     let request = {"oldOrderIds": [this.order.orderId]};
     // enable until backend uses soft-delete and remove this order id from
     // Solr index
     this._dataService.deleteGssOrder(request).subscribe(res => {
     });
     this.cancel();
  }

}