
//Classes imports
import { Http } from "./http";
import { Utils } from "./user-service";

//Interfaces imports
import { Restaurant } from "../interfaces/restaurant";
import { Comment } from "../interfaces/comment";
import { RestaurantsResponse, SingleRestaurantResponse, SingleCommentResponse, CommentsResponse } from "../interfaces/responses";

//Constants imports
import restaurantTemplate from "../handlebars/restaurant.hbs";
import commentTemplate from "../handlebars/comment.hbs";
import { SERVER, RESTAURANTS_ENDPOINT } from "../constants";

import Swal from "sweetalert2";

const utils = new Utils();

export class RestaurantService {
    constructor(private dbConnection: Http = new Http()) { }

    async getAll(): Promise<Restaurant[]> {
        console.log("rest-service: Getting All");
        const resp = this.dbConnection.get<RestaurantsResponse>(SERVER + RESTAURANTS_ENDPOINT);
        return (await resp).restaurants;
    }

    async get(id: number): Promise<Restaurant> {
        console.log("rest-service: Getting " + id);
        const resp = this.dbConnection.get<SingleRestaurantResponse>(SERVER + RESTAURANTS_ENDPOINT + "/" + id);
        return (await resp).restaurant;
    }

    async post(restaurant: Restaurant): Promise<Restaurant> {
        console.log("rest-service: Posting restaurant:");
        console.log(restaurant);
        const resp = await this.dbConnection.post<SingleRestaurantResponse, Restaurant>(SERVER + RESTAURANTS_ENDPOINT, restaurant);
        return resp.restaurant;
    }

    async delete(id: number): Promise<void> {
        console.log("rest-service: Deleting: " + id);
        return this.dbConnection.delete(SERVER + RESTAURANTS_ENDPOINT + "/" + id);
    }

    async getComments(restaurantId: number): Promise<Comment[]> {
        console.log("rest-service: getComments " + restaurantId);
        const resp = this.dbConnection.get<CommentsResponse>(SERVER + RESTAURANTS_ENDPOINT + "/" + restaurantId + "/comments");
        return (await resp).comments;
    }

    async addComment(restaurantId: number, comment: Comment): Promise<Comment> {
        console.log("rest-service: AddComment on: " + restaurantId);
        console.log(comment);
        const resp = this.dbConnection.post<SingleCommentResponse, Comment>(SERVER + RESTAURANTS_ENDPOINT + "/" + restaurantId + "/comments", comment);
        return (await resp).comment;
    }

    public comment2HTML(comment: Comment): string | Node {
        console.log(comment);

        const col: HTMLDivElement = document.createElement("div");
        col.classList.add("col");

        const commentHTML = commentTemplate({
            ...comment,
            fullStars: utils.getFullStars(comment),
            emptyStars: utils.getEmptyStars(comment),
        });

        col.innerHTML = commentHTML;
        return col;
    }

    public restaurant2HTML(restaurant: Restaurant): string | Node {
        console.log(restaurant);

        const col: HTMLDivElement = document.createElement("div");
        col.classList.add("col");

        const restHTML = restaurantTemplate({
            ...restaurant,
            open: utils.isOpen(restaurant),
            days: utils.getDaysStr(restaurant),
            fullStars: utils.getFullStars(restaurant),
            emptyStars: utils.getEmptyStars(restaurant),
            distance: utils.getDistanceFormated(restaurant),
        });

        col.innerHTML = restHTML;

        if (restaurant.mine) {
            col.querySelector("button")!.addEventListener("click", async () => {
                if (confirm("¿Are you sure you want to delete this restaurant?")) {
                    try {
                        if (restaurant.id !== undefined) {
                            await this.delete(restaurant.id);
                        }
                        location.assign("index.html");
                    } catch (e) {
                        Swal.fire({
                            title: "Error ocurred",
                            text: "Error deleting restaurant!",
                            icon: "error"
                        });
                        console.error(e);
                    }
                }
            });
        }

        return col;
    }
}