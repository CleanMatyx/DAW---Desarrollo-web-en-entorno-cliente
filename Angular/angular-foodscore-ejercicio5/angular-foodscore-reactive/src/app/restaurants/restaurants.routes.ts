import { Routes } from "@angular/router";
import { leavePageGuard } from "../shared/guards/leave-page.guard";
import { numericIdGuard } from "../shared/guards/numeric-id.guard";
import { restaurantsResolver } from "./resolver/restaurants.resolver";

export const restaurantsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./restaurants-page/restaurants-page.component').then(
            (m) => m.RestaurantsPageComponent
            ),    title: 'Restaurants Page | Angular Foodscore'
    },
    {
        path: 'add',
        loadComponent: () =>
            import('./restaurant-form/restaurant-form.component').then(
            (m) => m.RestaurantFormComponent
            ),  title: 'Nuevo Restaurante | Angular Foodscore',
            canDeactivate: [leavePageGuard]
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./restaurant-details/restaurant-details.component').then(
                (m) => m.RestaurantDetailsComponent
            ), resolve: { restaurant: restaurantsResolver },
            canActivate: [numericIdGuard]
    }
]
