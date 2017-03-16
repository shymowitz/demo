import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../cio-cs/gss/services/common.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(
        private route: ActivatedRoute,
        private router: Router
  ) { }

  ngOnInit() {
     if (CommonService.isTokenExpired()){
        //  this.router.navigate(['login']);
        window.location.replace(environment.loginUrl); 
     } else {
          
     }
  }

}
