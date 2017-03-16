import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AlertService, AuthenticationService } from '../../services/authentication/index';
import { CommonService } from '../../cio-cs/gss/services/common.service';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})

/**
 * for login page
 */
export class LoginComponent implements OnInit {
    loading = false;
    returnUrl: string = null;

    user = {
        id: '',
        username: '',
        email: '',
        password: '',
        remember: false,
        firstName: '',
        lastName: ''
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        // reset login status
        //this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // get query parameter email redirected from eGOS
        this.route.queryParams.map(queryParams => this.handleQueryParams(queryParams)).
            subscribe(
            () => {
                this.onParamsOrQueryParamsChange();
            },
            error => console.log("ngOnInit Error happened", error),
            () => console.log("the subscription is completed")
            );
    }

    handleQueryParams(params) {
        if (params['email']) {
            this.user.email = decodeURIComponent(params['email']);
        }
    }
    /**
     * if email present in query parameter
     * post to backend for authentication token
     */
    onParamsOrQueryParamsChange() {
        if (!CommonService.isTokenExpired()){
           let utype = CommonService.userInfo.userType;
           if (utype === 'NITAAC' || utype === 'CONTRACTOR'){
              this.router.navigate(['orderlist/p']);
           } else {
              this.router.navigate(['products']);
           }
        } else if (this.user.email) {
            this.login();
        }
    }
    login() {
        this.loading = true;
        this.authenticationService.login(this.user.email, this.user.password)
            .subscribe(
            data => {
                let utype = CommonService.userInfo.userType;
                if (utype === 'NITAAC' || utype === 'CONTRACTOR'){
                   this.router.navigate(['orderlist/p']);
                } else {
                   this.router.navigate(['products']);
                }
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    // navigateTo() {
    //     let url = '';
        
    //     let utype = CommonService.userInfo.userType;
    //     //   if (utype === 'NITAAC'){
    //     //         url = '/orderlist/p?user='+utype;
    //     //         return url;
    //     //   }
    //     //   else if(utype === 'CONTRACTOR'){
    //     //       this.router.navigate(['orderlist'], { queryParams: {type: utype}});

    //     //   }
             
    //     // else{
    //     //     url = '/products';
    //     //     return url;
    //     // }

        
    // }
    navigateTo() {
       let url = '';
    //    if (this.returnUrl) {
    //       url = this.returnUrl;
    //    } else   
       {
          let utype = CommonService.userInfo.userType;
          if (utype === 'CONTRACTOR' || utype === 'NITAAC')
             url = '/orderlist/p?user='+utype;
          else 
             url = '/products';
       }
       return url;
    }
}
