import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from '../app/nitaac/cio-cs/gss/components/products/products.component';
import { OfferingsComponent } from '../app/nitaac/cio-cs/gss/components/products/product-offerings/product-offerings.component';
import { ProductDetailsComponent } from '../app/nitaac/cio-cs/gss/components/products/product-details/product-details.component';
import { OrderSummaryComponent } from '../app/nitaac/cio-cs/gss/components/order-summary/order-summary.component';
import { FinalizeOrderComponent } from '../app/nitaac/cio-cs/gss/components/finalize-order/finalize-order.component';
import { SavedPlacedOrderList } from '../app/nitaac/cio-cs/gss/components/saved-placed-orders/order-list';
import { SavedPlacedOrderDetail } from '../app/nitaac/cio-cs/gss/components/saved-placed-orders/order-detail';
import { CustomerGssHeaderComponent } from './nitaac/cio-cs/gss/components/header/customer-gss-header/customer-gss-header.component';
import { ChGssHeaderComponent } from './nitaac/cio-cs/gss/components/header/ch-gss-header/ch-gss-header.component';
import { NitaacGssHeaderComponent } from './nitaac/cio-cs/gss/components/header/nitaac-gss-header/nitaac-gss-header.component';
import { AuthGuard } from '../app/nitaac/services/authentication/index';
import { LoginComponent } from '../app/nitaac/components/login/login.component';
import { NotFoundComponent } from './nitaac/components/not-found/not-found.component';


export const appRoute: Routes = [
    { path: '', redirectTo: 'Login', pathMatch: 'full' },
    { path: 'products', component: ProductsComponent,canActivate: [AuthGuard] },
    { path: 'products/:id/offerings', component: OfferingsComponent,canActivate: [AuthGuard] },
    { path: 'products/:id/offerings/:clinId', component: ProductDetailsComponent,canActivate: [AuthGuard] },
    { path: 'ordersummary', component: OrderSummaryComponent,canActivate: [AuthGuard] },
    { path: 'checkout', component: FinalizeOrderComponent,canActivate: [AuthGuard] },
    { path: 'finalOrders', component: FinalizeOrderComponent,data:{isActiveCom:'ordersummary'} },
    { path: 'ordersummary/finalOrders', component: FinalizeOrderComponent,canActivate: [AuthGuard] },
    { path: 'orderlist/:type', component: SavedPlacedOrderList, canActivate: [AuthGuard] },
    { path: 'orderdetail/:orderId', component: SavedPlacedOrderDetail, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'customerGSS', component: CustomerGssHeaderComponent, canActivate: [AuthGuard] },

    // {
    //     path: 'customerGSS', children: [
    //         { path: '', component: ProductsComponent },
    //         { path: '', component: CustomerGssHeaderComponent }
    //     ]
    // },

    // { path: 'chgss/:type', component: ChGssHeaderComponent, canActivate: [AuthGuard] },
    // { path: 'nitaacgss/:type', component: NitaacGssHeaderComponent, canActivate: [AuthGuard] },
    {path: '**', component: NotFoundComponent}
];

export const appRouting = [
    RouterModule.forRoot(appRoute)
];
