// export interface Restaurant {
//   id?: number;
//   name: string;
//   image: string;
//   cuisine: string;
//   description: string;
//   phone: string;
//   daysOpen: string[];
// }


import { User } from "./user";

export interface RestaurantInsert {
    name: string;
    description: string;
    cuisine: string;
    daysOpen: string[];
    image: string;
    phone: string;
    address: string;
    lat: number;
    lng: number;
}

export interface Restaurant extends RestaurantInsert {
    id?: number;
    creator?: User;
    mine?: boolean;
    distance?: number;
    commented?: boolean;
    stars?: number;
}