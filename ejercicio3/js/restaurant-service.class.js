import { RESTAURANTS_ENDPOINT, SERVER } from "./constants.js";
import { Http } from "./http.js";

class RestaurantService {
    constructor() {
        this._http = new Http();
        this.baseUrl = `${SERVER}${RESTAURANTS_ENDPOINT}`;
        this.maxImageSize = 1024 * 1024; // 500KB máximo
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
            // Validar tamaño de imagen
            const imageSize = this._calculateBase64Size(restaurant.image);
            if (imageSize > this.maxImageSize) {
                throw new Error(`La imagen es demasiado grande (${Math.round(imageSize/1024)}KB). Máximo permitido: ${this.maxImageSize/1024}KB`);
            }

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

    _calculateBase64Size(base64String) {
        const padding = base64String.endsWith('==') ? 2 : 
                       base64String.endsWith('=') ? 1 : 0;
        return (base64String.length * 3) / 4 - padding;
    }
}

export { RestaurantService };