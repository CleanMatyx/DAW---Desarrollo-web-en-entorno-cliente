import { Routes } from "@angular/router";
import { leavePageGuard } from "../shared/guards/leave-page.guard";
import { numericIdGuard } from "../shared/guards/numeric-id.guard";
import { productResolver } from "./resolvers/product.resolver";

export const productsRoutes: Routes = [
    {
      path: '',
      loadComponent: () =>
        import('./products-page/products-page.component').then(
          (m) => m.ProductsPageComponent
        ),
      title: 'Productos | Angular Products',
    },
    {
      path: 'add',
      canDeactivate: [leavePageGuard],
      loadComponent: () =>
        import('./product-form/product-form.component').then(
          (m) => m.ProductFormComponent
        ),
      title: 'Añadir producto | Angular Products',
    },
    {
      path: ':id',
      canDeactivate: [leavePageGuard],
      canActivate: [numericIdGuard],
      resolve: {
        product: productResolver,
      },
      loadComponent: () =>
        import('./product-detail/product-detail.component').then(
          (m) => m.ProductDetailComponent
        ),
    },
  ];