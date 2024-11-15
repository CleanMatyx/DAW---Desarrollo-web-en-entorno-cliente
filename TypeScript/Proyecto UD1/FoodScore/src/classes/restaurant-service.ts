import { RESTAURANTS_ENDPOINT, SERVER } from "../constants.js";
import { Http } from "./http.js";
import { RestaurantInsert, Restaurant } from "../interfaces/restaurant.js";
import { Comment } from "../interfaces/comment.js";

export class RestaurantService {
    private _http: Http;
    private baseUrl: string;

    constructor() {
        this._http = new Http();
        this.baseUrl = `${SERVER}${RESTAURANTS_ENDPOINT}`;
    }

    async getAll(): Promise<Restaurant[]> {
        try{
            const response: { restaurants?: Restaurant[] } = await this._http.get(this.baseUrl);
            return response.restaurants || [];
        } catch (error) {
            console.log('Error al obtener restaurantes: ', error);
            return [];
        }
    }

    async get(id: number): Promise<Restaurant> {
        try {
            const response: { restaurant: Restaurant } = await this._http.get(`${this.baseUrl}/${id}`);
            return response.restaurant;
        } catch (error) {
            console.error('Error al obtener restaurante:', error);
            throw error;
        }
    }

    async post(restaurant: RestaurantInsert): Promise<Restaurant> {
        try {
            const restaurantData = {
                name: restaurant.name,
                description: restaurant.description,
                daysOpen: restaurant.daysOpen,
                phone: restaurant.phone,
                cuisine: restaurant.cuisine,
                image: restaurant.image,
                address: restaurant.address,
                lat: restaurant.lat,
                lng: restaurant.lng
            };

            const response: { restaurant: Restaurant } = await this._http.post(this.baseUrl, restaurantData);
            return response.restaurant;
        } catch (error) {
            console.error('Error al crear restaurante:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this._http.delete(`${this.baseUrl}/${id}`);
        } catch (error) {
            console.error('Error al eliminar restaurante:', error);
            throw error;
        }
    }

    async getComments(restaurantId: number): Promise<Comment[]> {
        try {
            const response: { comments: Comment[] } = await this._http.get(`${this.baseUrl}/${restaurantId}/comments`);
            return response.comments || [];
        } catch (error) {
            console.error('Error al obtener comentarios:', error);
            return [];
        }
    }

    async addComment(restaurantId:number, comment: Comment): Promise<Comment> {
        try {
            const response: { comment: Comment } = await this._http.post(`${this.baseUrl}/${restaurantId}/comments`, comment);
            return response.comment;
        } catch (error) {
            console.error('Error al agregar comentario:', error);
            throw error;
        }
    }

    toHTML(
        restaurant: Restaurant,
        restTemplate: HTMLTemplateElement,
        fBorrar: () => void,
    ): HTMLDivElement {
        const clone = document.importNode(restTemplate.content, true);
        
        const div = clone.querySelector('div');
        if (div) {
            const nameElement = div.querySelector('.restaurant-name');
            const addressElement = div.querySelector('.restaurant-address');
            const deleteButton = div.querySelector('.delete-button');
    
            if (nameElement) {
                nameElement.textContent = restaurant.name;
            }
    
            if (addressElement) {
                addressElement.textContent = restaurant.address;
            }
    
            if (deleteButton) {
                deleteButton.addEventListener('click', fBorrar);
            }
        }
    
        const container = document.createElement('div');
        container.appendChild(clone);
    
        return container;
    }
}