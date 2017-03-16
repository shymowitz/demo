import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'rfq-modal',
  templateUrl: './rfq-modal.component.html',
  styleUrls: ['./rfq-modal.component.scss'],
})
/**
 * 
 */
export class RfqModal  {
   @Input('modal') myName: string='rfqModal';
   @Input('order') order: any;
   // bind #childModal in this template to #deleteModal in parent template
   @ViewChild('childModal') rfqModal: any;

   constructor( protected _dataService: DataService) {}
   ngOnInit() {
   }
   ngAfterViewInit() {
    
   }

   /**
    * Called from Order List template
    * action = 'delete' 
    */
   showModal(order: any, index: number) {
      try {
         this.order = order;
         this[this.myName].show();
      } finally {

      }
  }
  cancel() {
    if (this.order) {
       this.order = null;
    }
    this[this.myName].hide();
  }
 

}