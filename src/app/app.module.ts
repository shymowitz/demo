
//predefined

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule, MdSnackBar } from '@angular/material';
import { RouterModule } from '@angular/router';
import { PopoverModule } from "ngx-popover";


//user defined
import {AppComponent} from './app.component';
import {ProductsComponent} from '../app/nitaac/cio-cs/gss/components/products/products.component';
import {OfferingsComponent} from '../app/nitaac/cio-cs/gss/components/products/product-offerings/product-offerings.component';
import {OrderSummaryComponent} from '../app/nitaac/cio-cs/gss/components/order-summary/order-summary.component';
import {CommonService} from '../app/nitaac/cio-cs/gss/services/common.service';
import {GlobalService} from '../app/nitaac/cio-cs/gss/services/global.service';
import {DataService} from '../app/nitaac/cio-cs/gss/services/data.service';
import {HttpService} from '../app/nitaac/cio-cs/gss/services/http.service';
import {AlertService, AuthGuard, AuthenticationService} from '../app/nitaac/services/authentication/index';
import {CustomHttp} from '../app/nitaac/cio-cs/gss/services/custom.http.service';
import { Http, XHRBackend,ConnectionBackend, Headers,Request, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';

import {ServiceUrls} from '../app/nitaac/cio-cs/gss/shared/serviceUrl';
import {filters} from '../app/nitaac/cio-cs/gss/shared/config';
import 'hammerjs';
import { RestrictKeys } from '../app/nitaac/cio-cs/gss/shared/restrictKeys';
import {appRouting} from './app.routing';

import {ProductPipe} from '../app/nitaac/cio-cs/gss/shared/pipes/productPipe';
import {ProductDetailsComponent} from '../app/nitaac/cio-cs/gss/components/products/product-details/product-details.component';
import {FinalizeOrderComponent} from '../app/nitaac/cio-cs/gss/components/finalize-order/finalize-order.component';
import {ProductFilter} from '../app/nitaac/cio-cs/gss/shared/pipes/productFilter';
import {ProductOrderFilter} from '../app/nitaac/cio-cs/gss/shared/pipes/product-orderFilter';

import {SavedPlacedOrderList} from '../app/nitaac/cio-cs/gss/components/saved-placed-orders/order-list';
import {SavedPlacedOrderDetail} from '../app/nitaac/cio-cs/gss/components/saved-placed-orders/order-detail';
import {MyModal} from '../app/nitaac/cio-cs/gss/components/saved-placed-orders/modals/modal.component';
import {PocModal} from '../app/nitaac/cio-cs/gss/components/saved-placed-orders/modals/poc-modal.component';
import {RfqModal} from '../app/nitaac/cio-cs/gss/components/saved-placed-orders/modals/rfq-modal.component';
import { LoginComponent } from '../app/nitaac/components/login/login.component';

import { DatePipe } from '@angular/common';
import { Ng2PaginationModule } from 'ng2-pagination';
import { ModalModule } from 'ng2-bootstrap';
import { CompareProductComponent } from './nitaac/cio-cs/gss/components/compare-product/compare-product.component';
import { CustomerGssHeaderComponent } from './nitaac/cio-cs/gss/components/header/customer-gss-header/customer-gss-header.component';
import { ChGssHeaderComponent } from './nitaac/cio-cs/gss/components/header/ch-gss-header/ch-gss-header.component';
import { NitaacGssHeaderComponent } from './nitaac/cio-cs/gss/components/header/nitaac-gss-header/nitaac-gss-header.component';
import { ProductsFilterComponent } from './nitaac/cio-cs/gss/shared/components/products-filter/products-filter.component';
import { SearchComponent } from './nitaac/cio-cs/gss/shared/components/search/search.component';
import { NotFoundComponent } from './nitaac/components/not-found/not-found.component';
import { StandardConfigurationComponent } from './nitaac/cio-cs/gss/components/standard-configuration/standard-configuration.component';



// a factory for overriding native http class.
// see comments in services/custom.http.service.ts for details
export function customHttpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions): Http {
   return new CustomHttp(xhrBackend, requestOptions);
}

@NgModule({
    declarations: [
        AppComponent,
        ProductsComponent,
        OfferingsComponent,
        OrderSummaryComponent,
        ProductPipe,
        ProductFilter,
        ProductOrderFilter,
        ProductDetailsComponent,
        FinalizeOrderComponent,
        SavedPlacedOrderList,
        SavedPlacedOrderDetail,
        MyModal,
        PocModal,
        RfqModal,
        LoginComponent,
        CompareProductComponent,
        RestrictKeys,
        CustomerGssHeaderComponent,
        ChGssHeaderComponent,
        NitaacGssHeaderComponent,
        ProductsFilterComponent,
        SearchComponent,
        NotFoundComponent,
        StandardConfigurationComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterialModule.forRoot(),
        appRouting,
        PopoverModule,
        Ng2PaginationModule,
        ModalModule.forRoot(),
        //Ng2Webstorage
    ],
    providers: [
          { provide: Http, useFactory: customHttpFactory, deps: [XHRBackend, RequestOptions]}
         ,
         CommonService, HttpService, GlobalService, DataService, ProductPipe, ProductFilter, 
                ProductOrderFilter, DatePipe,
                AlertService, AuthGuard, AuthenticationService,
                ],
    bootstrap: [AppComponent]
})

export class AppModule { }
