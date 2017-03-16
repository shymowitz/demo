import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response } from '@angular/http';
//import { HttpService } from '../http.service';
//import { ServiceUrls } from '../../shared/serviceUrl';
import { Router } from '@angular/router';
//import {CommonService} from '../../services/common.service';
import 'rxjs/add/operator/map';
import { HttpService } from '../../cio-cs/gss/services/http.service';
import { ServiceUrls } from '../../cio-cs/gss/shared/serviceUrl';
import {CommonService} from '../../cio-cs/gss/services/common.service';
import 'rxjs/add/operator/map'
import { environment } from '../../../../environments/environment';

/**
 * used by login compponent
 */
@Injectable()
export class AuthenticationService {
    account: any = {};
    constructor(private _httpService: HttpService, protected _router: Router ) { }

    login(email: string, password: string) {
        let request = {email: email};
        return this._httpService.post(ServiceUrls.loginWithEmail, request)
            .map((data: Response) => {
                // login successful if there's a jwt token in the response
                if ( data && data['token'] ) {
                    // store user details and jwt token in local storage or cookie to keep user logged in between page refreshes
                    CommonService.saveUserInfo(data['token']);
                }
            });
    }

    logout() {
      CommonService.removeAuthToken();
      this.account = {};
      //   this._router.navigate(['/login']);
      window.location.replace(environment.loginUrl); 
   }

}