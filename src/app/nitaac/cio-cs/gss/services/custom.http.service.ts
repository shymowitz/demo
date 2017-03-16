import { Injectable } from '@angular/core';
import { Http, ConnectionBackend, Request, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {CommonService} from './common.service';

/**
 * Override build-in @angular/http
 * by adding Authentication header to all request
 * To config, add a function just before @NgModule if app.module.ts
 * function customHttpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions): Http {
      return new CustomHttp(xhrBackend, requestOptions);
 * }
 * In providers array, add an entry
 *    { provide: Http, useFactory: customHttpFactory, deps: [XHRBackend, RequestOptions]}
 * }
 * Then all native http call will have authentication header attached
 * automatically
 */
@Injectable()
export class CustomHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }
  request(url: Request, options?: RequestOptionsArgs): Observable<Response> {
    url.headers = CommonService.createAuthHeader();
    // url.withCredentials =  true;
    // XMLHttpRequest cannot load http://localhost:8080/api/users/loginWithEmail. 
    // Response to preflight request doesn't pass access control check: 
    // The value of the 'Access-Control-Allow-Origin' header in the response 
    // must not be the wildcard '*' when the request's credentials mode is 
    // 'include'. Origin 'http://localhost:4200' is therefore not
    //  allowed access. The credentials mode of requests initiated by the 
    // XMLHttpRequest is controlled by the withCredentials attribute.
    return super.request(url, options);
  }

//   get(url: string, options?: RequestOptionsArgs): Observable<Response> {
//     console.log('CustomHttp get...');
//     // let myHeader = this.setHeaders();
//     // if (!options) {
//     //     options = new RequestOptions({ headers: myHeader });
//     // } else {
//     //     options.headers = myHeader;
//     // }
//     return super.get(url, options);
//   }

//   post(url, params) {
//       console.log('CustomHttp post...');
//       return super.post(url, params);
//     //   let myHeader = this.setHeaders();
//     //   return super.post(url, params, { headers: myHeader });
//   }

}
