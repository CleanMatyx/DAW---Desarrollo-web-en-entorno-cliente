
//Classes imports
import { Http } from "./http";
// import { Utils } from "./utils-service";

//Interfaces imports
import { Restaurant } from "../interfaces/restaurant";
import { Comment } from "../interfaces/comment";
import { RestaurantsResponse, SingleRestaurantResponse, SingleCommentResponse, CommentsResponse } from "../interfaces/responses";

//Constants imports
import { RESTAURANT_TEMPLATE } from "../constants";
// import Handlebars from "handlebars";
// // const restaurantTemplateElement = document.getElementById('restaurantTemplate');
// // if (!restaurantTemplateElement) {
// //     throw new Error("Restaurant template element not found");
// // }
// // const restaurantTemplate: Handlebars.TemplateDelegate = Handlebars.compile(restaurantTemplateElement.innerHTML);

// const restaurantTemplate: Handlebars.TemplateDelegate = Handlebars.compile("../templates/restaurant.hbs");
// const commentTemplate: Handlebars.TemplateDelegate = Handlebars.compile("../templates/comment.hbs");
import { SERVER, RESTAURANTS_ENDPOINT } from "../constants";
// import Swal from "sweetalert2";
// const utils = new Utils();

export class RestaurantService {
    private http: Http;
    public page: number;
    public search: string;
    public more: boolean;

    constructor() {
        this.http = new Http();
        this.page = 1;
        this.search = "";
        this.more = false;
    }

    async getAll(): Promise<Restaurant[]> {
        console.log("rest-service: Getting All");
        const resp = this.http.get<RestaurantsResponse>(SERVER + RESTAURANTS_ENDPOINT);
        return (await resp).restaurants;
    }

    async get(id: number): Promise<Restaurant> {
        console.log("rest-service: Getting " + id);
        const resp = this.http.get<SingleRestaurantResponse>(SERVER + RESTAURANTS_ENDPOINT + "/" + id);
        return (await resp).restaurant;
    }

    async post(restaurant: Restaurant): Promise<Restaurant> {
        console.log("rest-service: Posting restaurant:");
        console.log(restaurant);
        const resp = await this.http.post<SingleRestaurantResponse, Restaurant>(SERVER + RESTAURANTS_ENDPOINT, restaurant);
        return resp.restaurant;
    }

    async delete(id: number): Promise<void> {
        console.log("rest-service: Deleting: " + id);
        return this.http.delete(SERVER + RESTAURANTS_ENDPOINT + "/" + id);
    }

    async getComments(restaurantId: number): Promise<Comment[]> {
        console.log("rest-service: getComments " + restaurantId);
        const resp = this.http.get<CommentsResponse>(SERVER + RESTAURANTS_ENDPOINT + "/" + restaurantId + "/comments");
        return (await resp).comments;
    }

    async addComment(restaurantId: number, comment: Comment): Promise<Comment> {
        console.log("rest-service: AddComment on: " + restaurantId);
        console.log(comment);
        const resp = this.http.post<SingleCommentResponse, Comment>(SERVER + RESTAURANTS_ENDPOINT + "/" + restaurantId + "/comments", comment);
        return (await resp).comment;
    }

    // public comment2HTML(comment: Comment): string | Node {
    //     console.log(comment);

    //     const col: HTMLDivElement = document.createElement("div");
    //     col.classList.add("col");

    //     const commentHTML = commentTemplate({
    //         ...comment,
    //         fullStars: utils.getFullStars(comment),
    //         emptyStars: utils.getEmptyStars(comment),
    //     });

    //     col.innerHTML = commentHTML;
    //     return col;
    // }

    public restaurant2HTML(restaurant : Restaurant , deleteCard : () => Promise<void>) : HTMLDivElement {

        const div : HTMLDivElement = document.createElement('div');
        const restTemplate = RESTAURANT_TEMPLATE.content.cloneNode(true) as HTMLElement;

        (restTemplate.querySelector(".card-img-top") as HTMLImageElement).src = restaurant.image;
        (restTemplate.querySelector(".card-title") as HTMLElement).textContent = restaurant.name;
        (restTemplate.querySelector(".card-text") as HTMLElement).textContent = restaurant.description;
        (restTemplate.querySelector("small.cuisine") as HTMLElement).textContent = restaurant.cuisine; 
        (restTemplate.querySelector("span.phone") as HTMLElement).textContent = restaurant.phone;
        (restTemplate.querySelector(".distance") as HTMLElement).textContent = 
        restaurant.distance !== undefined ? Intl.NumberFormat('es-ES' , {maximumFractionDigits: 2}).format(restaurant.distance) + "km" : "N/A";

        (restTemplate.querySelector("div>a") as HTMLLinkElement).href = "restaurant-detail.html?id=" + restaurant.id;

        (restTemplate.querySelector(".card-title") as HTMLElement).addEventListener("click" , () => {
            location.assign("restaurant-detail.html?id=" + restaurant.id);
        });
        
        const day = new Date();
        const daysOpenArray = this.daysOpen(restaurant.daysOpen);
    
        (restTemplate.querySelector("span.days") as HTMLElement).textContent += daysOpenArray.join(",");
    
        if(restaurant.daysOpen.includes(day.getDay().toString())){
            restTemplate.querySelector(".bg-danger")!.classList.add("d-none");
        }else{
            restTemplate.querySelector(".bg-success")!.classList.add("d-none");
        }  

        if(restaurant.mine === false){            
            (restTemplate.querySelector(".delete") as HTMLElement).classList.add("d-none");
        }

        restTemplate.querySelector("button.delete")!.addEventListener("click" , () => {
            const tryDelete = confirm("Are you sure you want to delete this restaurant?");

            if(tryDelete){
                deleteCard();
            }
        });

        div.append(restTemplate);
        return div;
    }

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
}