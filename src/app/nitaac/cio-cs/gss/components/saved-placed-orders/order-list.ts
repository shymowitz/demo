import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { DataService } from '../../services/data.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/merge';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';

@Component({
  selector: 'order-list',
  templateUrl: './placed-order-list.html',
  styleUrls: ['./placed-order-list.scss']
})

/**
 */
export class SavedPlacedOrderList implements OnInit {
  listType: string = 'p';
  listLabel: string = 'Placed Orders';
  userType: string = null;
  searchString: string = '';
  pageNum: number = 1;
  perPage: number = 10;
  totalPages: number = 0;
  includeSavedOrders: boolean = false;
  includePlacedOrders: boolean = false;

  userId: string = null;
  orgId: string = null;
  onLoading = true;
  orders: any = [];
  ordersCount: number = 10;
  email: string = null;

  // if test === true, use client side pagination
  test = false;
  // for client side pagination, ordersSaved hold all 
  // original order list.
  ordersSaved: any = [];
  constructor(protected _commonService: CommonService, protected location: Location, protected route: ActivatedRoute, protected _dataService: DataService) {}

  /**
   * Get request query parameters
   */
  ngOnInit() {
    // merge parameter and/or query parameters
    Observable.merge(
      this.route.params.map(params => this.handleParams(params))
      // this.route.queryParams.map(queryParams => this.handleQueryParams(queryParams))
    ).subscribe(
       () => { 
               this.onParamsOrQueryParamsChange();
             },
       error => console.log("ngOnInit Error happened", error),
       () => console.log("the subscription is completed")
    );
  }

  handleParams(params) {
     console.log('params', params);
     if (params['type']) {
        this.listType = params['type'];
    }  
  }
  handleQueryParams(params) {
    //  console.log('query params', params);
    //  if (params['user']) {
    //     this.userType = params['user'].toUpperCase();
    //  } else {
    //    this.userType = null;
    //  }
  }

  onParamsOrQueryParamsChange() {
    if (this.listType) {
       this.setUserMetadata();
       this.getList();
    }
  }

  back() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  handleSearchChange(search) {
    this.searchString = search;
  }
  setUserMetadata() {
    if (this.listType === 's') {
       this.listLabel = 'Saved Orders';
    } else if (this.listType === 'p') {
       this.listLabel = 'Placed Orders';
    } else {
       this.listLabel = 'Fulfilled Orders';
    }
    this.includeSavedOrders = (this.listType === 's');
    this.includePlacedOrders = (this.listType === 'p');
  }
  setPostRequest() {
    let user = CommonService.userInfo;
    let postRequest = {
      userType: user.userType,
      userId: user.userId,
      pageSize: this.perPage,

      pageNo: this.pageNum-1,
      includeSavedOrders: this.includeSavedOrders,
      includePlacedOrders: this.includePlacedOrders
      };
      if (user.orgId) {
        postRequest['orgId'] = user.orgId; 
      }
      console.log('postRequest', postRequest)
      return postRequest;

  }

  /** 
   * Search based on 5 digits oder id, aka name_code
   */
  search() {
    if (this.searchString.length===0)
       return;

    let data = {'keyword': this.searchString};

    return this._dataService.findOrderByKeywordSolr(data).subscribe(res => {
      this.orders = res.orders;
      this.getTotalCount(res);
    })
  }

  /**
   * getList()
   * Get order list from backend. If pagination parameters are 
   * set, backend should retunn paginated data
   */
  getList() {
    this.orders=[];

    this.onLoading = true;
    this._dataService.listOrders(this.setPostRequest()).subscribe(res => {
      this.orders = res.orders;
      this.getTotalCount(res);

      if (this.test === true) {
        this.ordersSaved = [];
        for (let i = 0; i < this.orders.length; i++) {
          let order = Object.create(this.orders[i]);
          this.ordersSaved.push(order);
        }
        this.setPage(this.pageNum);
      } else {
        // do nothing
      }
      this.onLoading = false;
    }, error => console.log(error));
  }
  
  getOrderDetailLink(order) {
    return ['/orderdetail', order.orderIdf];
  }

  orderAction(order) {
    let orderAction = 'PLACE ORDER';
    if (order.status === 'SUBMIT') {
       orderAction = 'ORDER AGAIN';
    }
    return orderAction;
  }
  /**
   * customerInfo(order)
   * Compose customer name and organization name
   */
  customerInfo(order) {
    let info = '';
    if (this.userType==='CUSTOMER') {
       let status = {'SAVE': 'Saved Order',
                     'SUBMIT': 'Fulfilled Order',
                     'PENDING': 'Pending Order'}
       if (!order.status) {
          order.status = 'PENDING';
       }
       info = status[order.status];
    } else {
       info = "Customer Name: "+order.customerName + "  &nbsp;&nbsp; Organization: " + order.organizationName;
    }
    return info;
  }
  action(order) {
    let link = ['/orderdetail', order.orderIdf];
    return link;
  }
  actionLabel() {
     let label = 'View Order';
     return label;

  }
  /**
   * orderTitle(order)
   * Compose order title
   */
  orderTitle(order) {
    // let str = value.charAt(0).toUpperCase() + value.slice(1);
    return "Order ID # " + order.orderId;
    //    + " &nbsp;"  + str + " on "
    //    + this.datePipe.transform(order.createdDate, 'MM/dd/yy');
  }

  getTotalCount(data) {

     this.ordersCount = data.totalCount ? data.totalCount : data.orders.length;
     this.totalPages = Math.ceil((this.ordersCount / this.perPage));
     if (this.totalPages > 15 )
        this.totalPages = 15;
  }
  /**
   * setPage(page: number) 
   * Set pagination info, listen to the UI changes
   * on Item per page and page number.
   */
  setPage(page: number) {
    this.searchString = ''; //reset searchString
    this.pageNum = page;
    this.perPage = +this.perPage; // convert input value to number
    this.totalPages = Math.ceil((this.ordersCount / this.perPage));
    // console.log('this.totalPages', this.totalPages)
    if (page < 1 || page > this.totalPages) {
      return;
    }
    if (this.test === true) {
      let start = (page - 1) * this.perPage;
      this.orders = this.ordersSaved.slice(start, start + this.perPage);
      // console.log('this.perPage', this.perPage)
    } else {
      this.getList();
    }
  }
}
