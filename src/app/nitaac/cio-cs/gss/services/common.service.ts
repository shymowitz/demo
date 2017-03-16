import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Headers } from '@angular/http';
import { config } from '../shared/config';
import { environment } from '../../../../../environments/environment';
import { JwtHelper } from 'angular2-jwt';
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';

@Injectable()
export class CommonService {
    allProductsList: any = [];
    comparedProducts: any = [];
    count: number = 2;
    orders: any = [];
    checkoutData: any = [];

    resetCompare = new Subject<any>();
    resetCompareCalled = this.resetCompare.asObservable();

    public static userInfo = {
         userId: '',
         firstName: '',
         lastName: '',
         name: '',
         userRole: '',
         orgId: '',
         orgName: '',
         contractId: '',
         contractName: '',
         contractNo: '',
         sub: '',
         iss: '',
         iat: 0,
         exp: 0,
         userType: '',
         email: null
       }
    public static saveUserInfo(token) {
        this.setAuthToken(token);
        this.parseUserInfo();
    }
    // create http request header sent to backend 
    public static createAuthHeader() {
       let token = this.getAuthToken();
       let headers = new Headers();
       if (token) {
           if (this.authTokenKey==='currentUser')  {
              headers.append('Authorization', 'Bearer ' + token);
           } else {
              headers.append('Set-Cookie', token);
           }
       }
       return headers;
    }
    // remove the token in either locaStorage or Cookie
    public static removeAuthToken() {
        if (this.authTokenKey==='currentUser') {
           localStorage.removeItem(this.authTokenKey);
        } else {
           this.cookieService.remove(this.authTokenKey);
        }
        this.userInfo.email = null;
        
    }
    // localStorage key name or http request headers key name
    // Valid value 'currentUser' | 'Set-Cookie'
    private static authTokenKey: string = 'currentUser'; // 'Set-Cookie'
    // helper util to decode authentication token
    private static jwtHelper: JwtHelper = new JwtHelper();
    // decode authentication token
    private static decodeToken(token) {
        return this.jwtHelper.decodeToken(token);
    }
    // Util for cookie localStorage
    private static cookieService: CookieService = new CookieService();
    // set the token in either locaStorage or Cookie
    private static setAuthToken(token) {
        if (this.authTokenKey==='currentUser') {
           localStorage.setItem(this.authTokenKey, token);
        } else {
           this.cookieService.put(this.authTokenKey, token);
        }
    }
    // get the token in either locaStorage or Cookie
    private static getAuthToken() {
        let token = null
        if (this.authTokenKey==='currentUser') {
           token = localStorage.getItem(this.authTokenKey);
        } else {
           token = this.cookieService.get(this.authTokenKey);
        }
        return token;
    }
    public static isTokenExpired() {
        let token = this.getAuthToken();
        return !token || this.jwtHelper.isTokenExpired(token);
    }

    public static parseUserInfo() {
       let token = this.getAuthToken();
       if (token) {
          let user = this.decodeToken(token);
          if (user) {
             for ( let key of Object.keys(this.userInfo)) {
                if (user[key]) this.userInfo[key] = user[key];
             }
             this.userInfo.userType = this.parseUserType(user['userRole']); 
             this.userInfo.email = this.userInfo.sub;
          }
       }
       // console.log('userAccount', this.userInfo);
       return this.userInfo;
   }
   /**
     * userRole is from Authentication Token
     * return userType
     */
    private static parseUserType(userRole) {
       if (/^CONTRACTOR/i.test(userRole))
          // egostest7@gmail.com
          return 'CONTRACTOR';
       else if (/NITAAC/i.test(userRole))
          // egostest5@gmail.com
          return 'NITAAC';
       else  if (/^CUSTOMER/i.test(userRole))
          // egoscustomer1@gmail.com
          return 'CUSTOMER';

    }

    setAllProducts(products) {
        localStorage.setItem('allProducts', JSON.stringify(products));
        this.allProductsList = products;
    }

    getAllProducts() {
        return JSON.parse(localStorage.getItem('allProducts')) || [];
    }

    setCompareProducts(products) {
        this.comparedProducts = products;
        this.resetCompare.next(this.comparedProducts);

    }

    getComparedProducts() {
        return this.comparedProducts;
    }

    setOrders(product) {
        let existingindex = -1;
        this.orders = this.getOrders();
                for(let i=0;i<this.orders.length;i++) {
            if(this.orders[i].attributes.nitaacClin == product.attributes.nitaacClin) {
                existingindex = i;
            }
        }
        if(existingindex===-1) {
            this.orders.push(product);
        } else {
            this.orders[existingindex].quantity = this.orders[existingindex].quantity+product.quantity;
            this.orders[existingindex].addons = product.addons;
        }

        localStorage.setItem('order-summary', JSON.stringify({ orders: this.orders }));
    }

    resetOrders(orders) {
        this.orders = orders;
        localStorage.setItem('order-summary', JSON.stringify({ orders: this.orders }));
    }

    getOrders() {
        let orderDetails = JSON.parse(localStorage.getItem('order-summary') || '{}') || {};
        return orderDetails.orders ? orderDetails.orders : [];
    }

    setCheckoutData(data) {
        let checkData = [];
        let keys = Object.keys(data);
        for (let key of keys) {
            let obj = data[key];
            obj.contractorId = key;
            checkData.push(obj);
        }
        this.checkoutData = checkData;
        sessionStorage.setItem('checkoutData', JSON.stringify({ 'checkOrders': checkData }));
    }

    getCheckoutData() {
        //return this.checkoutData;
        return (this.checkoutData.length != 0) ? this.checkoutData : JSON.parse(sessionStorage.getItem('checkoutData') || '{}').checkOrders;
    }

    getConfiguration() {
        return config;
    }

    getGssFileSystemUrl() {
        return environment.gssFileSystemUrl;
    }
    
}
