import { Component, OnInit } from '@angular/core';
import { CommonService } from '../app/nitaac/cio-cs/gss/services/common.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../app/nitaac/services/authentication/authentication.service';
import { CustomerGssHeaderComponent } from './nitaac/cio-cs/gss/components/header/customer-gss-header/customer-gss-header.component';
import { ChGssHeaderComponent } from './nitaac/cio-cs/gss/components/header/ch-gss-header/ch-gss-header.component';
import { NitaacGssHeaderComponent } from './nitaac/cio-cs/gss/components/header/nitaac-gss-header/nitaac-gss-header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  account: any = {};
  userType;

  constructor(protected _router: Router) {
  }

  ngOnInit() {
    console.log("AppComponent ngoninit");
    CommonService.parseUserInfo();
    if (CommonService.isTokenExpired())
      CommonService.removeAuthToken();
  }

  getUserType() {
    this.account['userType'] = CommonService.userInfo.userType;
    return this.account['userType'];
  }

  // userEmail() {
  //   this.account.email = CommonService.userInfo.email;
  //   return this.account.email;
  // }
  // /**
  //  * delete authentication token from local storage
  //  */
  // logout() {
  //   console.log("AppComponent logout");
  //   CommonService.userInfo == null;
  //   CommonService.removeAuthToken();
  //   this.account = {};
  //   this._router.navigate(['/login']);
  // }
}
