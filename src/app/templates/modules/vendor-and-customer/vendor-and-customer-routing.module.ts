import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { VendorAndCustomerComponent } from "./components/vendor-and-customer/vendor-and-customer.component";
import { CustomerComponent } from "./components/customer/customer.component";
import { CustomerAddComponent } from "./components/customer-add/customer-add.component";

import { AddnewproductComponent } from "./components/addnewproduct/addnewproduct.component";
import { ProductSlideComponent } from './components/productslide/productslide.component';

// const routes: Routes = [
//   { path: "", component: VendorAndCustomerComponent, pathMatch: "full" }
// ];
const routes: Routes = [
  {
      path: '',
      pathMatch: 'full',
      redirectTo:'vendor'
  },

  {
    path: 'vendor',
    component: VendorAndCustomerComponent,
  },
 
  {
    path: 'customer',
    component: CustomerComponent
  },
  {
    path: 'addCustomer',
    component: CustomerAddComponent
  },
  {
    path: 'addnewproduct',
    component: AddnewproductComponent
  },
  {
    path: 'productslide',
    component: ProductSlideComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorAndCustomerRoutingModule {}
