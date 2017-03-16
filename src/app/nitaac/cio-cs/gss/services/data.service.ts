import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { HttpService } from './http.service';
import { ServiceUrls } from '../shared/serviceUrl';
import { config } from '../shared/config';

@Injectable()
export class DataService {
    config: any = config;

    constructor(private _httpService: HttpService) { }

    getProducts() {
        let params = new URLSearchParams();

        return this._httpService.get(ServiceUrls.allProducts, params).map(data => data);
    }

    getProductDetails(productId) {
        let params = new URLSearchParams();
        params.set('clinIdList', productId);
        return this._httpService.get(ServiceUrls.productDetails, params).map(data => data);
    }

    saveAndFinalizeOrder(orders) {
        let data = {
            order: orders.orders,
            customerId: this.config.customerId
        };

        return this._httpService.post(ServiceUrls.saveAndFinalizeOrder, orders).map(data => data);
    }
    searchUser(searchName, orgId) {
        return this._httpService.post(ServiceUrls.searchUser, { 'name': searchName, 'organizationId': orgId }).map(data => data);
    }

    placeOrder(data) {
        // let params = new URLSearchParams();
        // params.set('contractHolderId', data.contractHolderId);
        // params.set('orderId', data.orderId);
        // params.set('pocId', data.pocId);
        // params.set('gssshippingAddress', data.gssshippingAddress);
        // params.set('expectedDate', data.expectedDate);
        return this._httpService.post(ServiceUrls.placeOrder, data).map(data => data);
    }
    getComparedProducts(ids) {
        let params = new URLSearchParams();
        console.log('sample');
        console.log(ids);
        for (let id of ids) {

            params.append('clinIdList', id);
        }
        return this._httpService.get(ServiceUrls.compareDetails, params).map(data => data);
    }
    listOrders(data) {
        return this._httpService.post(ServiceUrls.gssFindOrderSolr, data).map(data => data);
    }
    findOrderByKeywordSolr(data) {
        return this._httpService.post(ServiceUrls.findOrderByKeywordSolr, data).map(data => data);
    }
    getOrder(data) {
        return this._httpService.post(ServiceUrls.orderShow, data).map(data => data);
    }
    placedOrderDetails(data) {
        return this._httpService.post(ServiceUrls.placedOrderDetails, data).map(data => data);
    }
    deleteGssOrder(data) {
        return this._httpService.post(ServiceUrls.deleteGssOrder, data).map(data => data);
    }
    loginWithEmail(data) {
        return this._httpService.post(ServiceUrls.loginWithEmail, data).map(data => data);
    }
}
