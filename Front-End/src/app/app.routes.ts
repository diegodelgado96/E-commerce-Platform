import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { OrderComponent } from './components/order/order.component';

export const routes: Routes = [
    {
        path: "pages",
        loadChildren: () => import("./components/layout/layout.routes").then(m=>m.routes)
    },
    {
        path: "**",
        redirectTo: "pages/Product",
        pathMatch: "full"
    }
];
