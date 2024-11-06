import { RESTAURANTS_ENDPOINT, SERVER } from "./constants.js";
import { Http } from "./http.js";

class RestaurantService {
    constructor() {
        this._http = new Http();
        this.baseUrl = `${SERVER}${RESTAURANTS_ENDPOINT}`;
    }

    async getAll() {
        try {
            const response = await this._http.get(this.baseUrl);
            return response.restaurants || [];
        } catch (error) {
            console.error('Error al obtener restaurantes:', error);
            return [];
        }
    }

    async post(restaurant) {
        try {
            const restaurantData = {
                name: restaurant.title,
                description: restaurant.description,
                daysOpen: restaurant.days,
                phone: restaurant.phone,
                cuisine: restaurant.cuisine,
                image: restaurant.image
            };

            const response = await this._http.post(this.baseUrl, restaurantData);
            return response.restaurant;
        } catch (error) {
            console.error('Error al crear restaurante:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            await this._http.delete(`${this.baseUrl}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar restaurante:', error);
            throw error;
        }
    }
}

export { RestaurantService };