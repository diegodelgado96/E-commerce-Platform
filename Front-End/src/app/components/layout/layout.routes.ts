import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ProductsComponent } from '../products/products.component';
import { OrderComponent } from '../order/order.component';

export const routes: Routes = [
    {
        path: "", 
        component: LayoutComponent,
        children: [
          {
            path: "Product", 
            component: ProductsComponent
          },
          {
            path: "Order", 
            component: OrderComponent
          }, 
        ]
      }
];
