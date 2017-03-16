import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { environment } from '../../../../../../../environments/environment';
import { StandardConfigurationComponent } from '../../standard-configuration/standard-configuration.component';
@Component({
  selector: 'CustomerGssHeader',
  templateUrl:'./customer-gss-header.component.html',
  styleUrls: ['./customer-gss-header.component.scss']
})
export class CustomerGssHeaderComponent implements OnInit {
  account: any = {};

    @ViewChild(StandardConfigurationComponent) std: StandardConfigurationComponent;
  constructor(protected _router: Router) { }

  ngOnInit() {
    CommonService.parseUserInfo();
    if (CommonService.isTokenExpired())
      CommonService.removeAuthToken();
  }
  getUserType() {
    this.account['userType'] = CommonService.userInfo.userType;
    return this.account['userType'];
  }
  userEmail() {
    this.account.email = CommonService.userInfo.email;
    return this.account.email;
  }

  openStdMenu() {
      this.std.open();
  }
  /**
   * delete authentication token from local storage
   */
  logout() {
      CommonService.removeAuthToken();
      this.account = {};
      // window.location.reload();
      window.location.replace(environment.loginUrl); 
   }

}