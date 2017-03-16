import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service'
import { environment } from '../../../../../../../environments/environment';


@Component({
  selector: 'CHGssHeader',
  templateUrl: './ch-gss-header.component.html',
  styleUrls: ['./ch-gss-header.component.scss']
})
export class ChGssHeaderComponent implements OnInit {

  account: any = {};
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
