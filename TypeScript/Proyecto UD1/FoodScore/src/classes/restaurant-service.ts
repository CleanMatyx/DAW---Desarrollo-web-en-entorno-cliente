//Classes imports
import { Http } from "./http";
import { Utils } from "./utils-service";

//Interfaces imports
import { Restaurant } from "../interfaces/restaurant";
import { Comment } from "../interfaces/comment";
import { User } from "../interfaces/user";
import { RestaurantsResponse, SingleRestaurantResponse, SingleCommentResponse, CommentsResponse } from "../interfaces/responses";

//Constants imports
import { SERVER, RESTAURANTS_ENDPOINT } from "../constants";
const utils = new Utils();

export class RestaurantService {
    private http: Http;
    public page: number;
    public search: string;
    public more: boolean;

    constructor() {
        this.http = new Http();
        this.page = 0;
        this.search = "";
        this.more = false;
    }

    //Get all the restaurants
    async getAll(): Promise<Restaurant[]> {
        console.log("rest-service: Getting All");
        const resp = this.http.get<RestaurantsResponse>(SERVER + RESTAURANTS_ENDPOINT);
        return (await resp).restaurants;
    }

    //Get a restaurant by id
    async get(id: number): Promise<Restaurant> {
        console.log("rest-service: Getting " + id);
        const resp = this.http.get<SingleRestaurantResponse>(SERVER + RESTAURANTS_ENDPOINT + "/" + id);
        return (await resp).restaurant;
    }

    //Post a restaurant
    async post(restaurant: Restaurant): Promise<Restaurant> {
        console.log("rest-service: Posting restaurant:");
        console.log(restaurant);
        const resp = await this.http.post<SingleRestaurantResponse, Restaurant>(SERVER + RESTAURANTS_ENDPOINT, restaurant);
        return resp.restaurant;
    }

    //Function that deletes a restaurant showing a confirmation dialog
    delete(id: number): void {
        console.log("rest-service: Deleting: " + id);
        this.http.delete(SERVER + RESTAURANTS_ENDPOINT + "/" + id)
            .then(() => {
                console.log('Deleted! Your restaurant has been deleted.');
            })
            .catch((error) => {
                console.error("Error deleting restaurant:", error);
            });
        
    }

    //Function that gets the comments of a restaurant
    async getComments(restaurantId: number): Promise<Comment[]> {
        console.log("rest-service: getComments " + restaurantId);
        const resp = this.http.get<CommentsResponse>(SERVER + RESTAURANTS_ENDPOINT + "/" + restaurantId + "/comments");
        return (await resp).comments;
    }

    //Function that adds a comment to a restaurant
    async addComment(restaurantId: number, comment: Comment): Promise<Comment> {
        console.log("rest-service: AddComment on: " + restaurantId);
        console.log(comment);
        const resp = this.http.post<SingleCommentResponse, Comment>(SERVER + RESTAURANTS_ENDPOINT + "/" + restaurantId + "/comments", comment);
        return (await resp).comment;
    }

    //Function that converts a comment object to an HTML element
    public comment2HTML(comment: Comment): string | Node {
        console.log(comment);
    
        //Obtain the template
        const template = document.getElementById('commentTemplate') as HTMLTemplateElement;
        if (!template) {
            throw new Error('Template not found');
        }
    
        //Clone the template
        const clone = template.content.cloneNode(true) as HTMLElement;
    
        //Fill the template with the comment data
        const avatar = clone.querySelector('.avatar img') as HTMLImageElement;
        const user: User = comment.user!;
        if (!user) {
            throw new Error('User not found');
        }
        avatar.src = user.avatar;
        avatar.alt = user.name;
    
        //Redirect to the user profile when clicking the avatar
        const nameLink = clone.querySelector('.name') as HTMLAnchorElement;
        nameLink.href ='/profile.html?id=' + user.id;
        nameLink.textContent = user.name;

        //Redirect to the user profile when clicking the name
        console.log(nameLink.href);
        const commentText = clone.querySelector('.comment') as HTMLSpanElement;
        commentText.textContent = comment.text;
    
        //Fill the stars
        const starsContainer = clone.querySelector('.stars') as HTMLDivElement;
        starsContainer.innerHTML = '★'.repeat(utils.getFullStars(comment).length) + '☆'.repeat(utils.getEmptyStars(comment).length);
    
        //Fill the date
        const dateElement = clone.querySelector('.date') as HTMLSpanElement;
        dateElement.textContent = comment.date ? new Date(comment.date).toLocaleDateString() : "N/A";
        
        //Return the clone
        return clone;
    }

    //Function that converts a restaurant object to an HTML element
    public restaurant2HTML(restaurant: Restaurant, deleteCard: () => Promise<void>): HTMLDivElement {
        const div: HTMLDivElement = document.createElement('div');
        const restTemplate = (document.getElementById('restaurantTemplate') as HTMLTemplateElement).content.cloneNode(true) as HTMLElement;
    
        (restTemplate.querySelector(".card-img-top") as HTMLImageElement).src = restaurant.image;
        (restTemplate.querySelector(".card-title a") as HTMLElement).textContent = restaurant.name;
        (restTemplate.querySelector(".card-text.description") as HTMLElement).textContent = restaurant.description;
        (restTemplate.querySelector(".cuisine") as HTMLElement).textContent = restaurant.cuisine;
        (restTemplate.querySelector(".phone span") as HTMLElement).textContent = restaurant.phone;
        (restTemplate.querySelector(".distance") as HTMLElement).textContent =
            restaurant.distance !== undefined ? Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(restaurant.distance) + " km" : "N/A";
        (restTemplate.querySelector(".stars") as HTMLElement).innerHTML = utils.generateStars(restaurant.stars ?? 0);
        (restTemplate.querySelector("div>a") as HTMLLinkElement).href = "restaurant-detail.html?id=" + restaurant.id;
        (restTemplate.querySelector(".card-title a") as HTMLElement).addEventListener("click", () => {
            location.assign("restaurant-detail.html?id=" + restaurant.id);
        });
    
        const day = new Date();
        const daysOpenArray = this.daysOpen(restaurant.daysOpen);
    
        //Set the days open
        (restTemplate.querySelector(".days span") as HTMLElement).textContent = daysOpenArray.join(",");
    
        //If the restaurant is open today, hide the closed badge and show the open badge
        if (restaurant.daysOpen.includes(day.getDay().toString())) {
            restTemplate.querySelector(".bg-danger")!.classList.add("d-none");
        } else {
            restTemplate.querySelector(".bg-success")!.classList.add("d-none");
        }
    
        //If the restaurant is not mine, hide the delete button
        if (restaurant.mine === false) {
            (restTemplate.querySelector(".delete") as HTMLElement).classList.add("d-none");
        }

        //If the restaurant is mine, show the delete button
        (restTemplate.querySelector("button.delete") as HTMLElement).addEventListener("click", () => {
                deleteCard();
        });
    
        div.append(restTemplate);
        return div;
    }

    //Function that converts a restaurant object to an HTML element
    daysOpen(day: string[]) {
        const daysMap: {[key: string]: string} = {
            0: "Dom",
            1: "Lun",
            2: "Mar",
            3: "Mie",
            4: "Jue",
            5: "Vie",
            6: "Sab"
        };
        return day.map(day => daysMap[day]);
    }

    //Function that gets the next page of restaurants
    public hasMoreRestaurants(): boolean {
        return this.more;
    }

    // //Function that sets the page
    // public setPage(page: number): void {
    //     this.page = page;
    // }
}