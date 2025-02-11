import { Routes } from '@angular/router';
import { RestaurantsPageComponent } from './restaurants-page/restaurants-page.component';

export const routes: Routes = [
    {
        path: 'restaurants',
        children: [
            {
                path: '',
                component: RestaurantsPageComponent,
                title: 'Restaurants | Angular Foodscore',
            },
        ],
    },
    { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
    { path: '**', redirectTo: '/restaurants' },
];
