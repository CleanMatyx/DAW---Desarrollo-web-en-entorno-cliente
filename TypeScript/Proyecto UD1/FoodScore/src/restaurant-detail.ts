//Classes imports
import { RestaurantService } from "./classes/restaurant-service";
import { AuthService } from "./classes/auth-service";

//Map imports
import { Coordinates } from "./interfaces/coordinates";
import { MapService } from "./classes/map-service";

//Interfaces imports
import { Restaurant } from "./interfaces/restaurant";
import { Comment } from "./interfaces/comment";

//SweetAlert
import Swal from "sweetalert2";

const authService = new AuthService();

//Check if the token is valid
authService.checkToken();

//If user is not logged, redirect to login page
if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
}

//Logout button
const logoutButton = document.querySelector("#logout");
if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        authService.logout();
    });
}

//Restaurant service
const restaurantService = new RestaurantService();
let restaurant: Restaurant;
let comments: Comment[];
const params = new URLSearchParams(window.location.search);
const id = params.get("id") as unknown as number;

//Function to get the restaurant and comments by id
async function getRestaurant(): Promise<void> {
    try {
        restaurant = await restaurantService.get(id);
        comments = await restaurantService.getComments(id);
    } catch (error) {
        console.log("Error: " + error);
        location.assign("index.html");
    }
    showRestaurants(restaurant);
}

//Function to show the Restaurant selected
function showRestaurants(restaurant: Restaurant): void {
    const container = <HTMLDivElement>document.getElementById("cardContainer");
    container.replaceChildren(
        restaurantService.restaurant2HTML(restaurant, async () => {
            if (restaurant.id !== undefined) {
                await restaurantService.delete(restaurant.id);
            } else {
                console.error("Restaurant ID is undefined");
            }
            container.remove();
        })
    );
}

//Comments container
const commentContainer = <HTMLDivElement>document.getElementById("comments");

//Show comments
function showComments(comments: Comment[]): void {
    if (!commentContainer) {
        console.error("Comment container is undefined");
        return;
    }
    commentContainer.replaceChildren(
        ...comments.map((e) => restaurantService.comment2HTML(e))
    );
}

//Get restaurant and show it
getRestaurant().then(() => {
    showMap();
    showOwner();
    showComments(comments);
    if (restaurant.commented) {
        commentForm.classList.add("d-none");
    }
});

//Add comment
 const commentForm = <HTMLFormElement>document.getElementById("commentForm");
 commentForm.addEventListener("submit", async (e) => {
     e.preventDefault();
     const newComment: Comment = {
         text: commentForm.comment.value,
         stars: Number(puntuacion),
     };

     //Verify if the comment is valid
     if (!newComment.text || isNaN(newComment.stars)) {
         console.log("Datos del comentario no válidos");
         return;
     }

     try {
         await restaurantService.addComment(id, newComment);
         location.reload();
     } catch (error) {
         console.log("Error: " + error);
         Swal.fire({
             title: "Error occurred",
             text: "Something went wrong",
         });
     }
 });

// Stars and value selection
const divStars = document.getElementById("stars") as HTMLDivElement;
let puntuacion: number = 0;

if (divStars) {
    const stars = divStars.getElementsByTagName("i");

    Array.from(stars).forEach((star) => {
        star.addEventListener("click", () => {
            puntuacion = parseInt(star.getAttribute("data-score") || "0", 10);

            // Cambiar el icono de cada estrella según la puntuación seleccionada
            Array.from(stars).forEach((s, index) => {
                if (index < puntuacion) {
                    s.classList.remove("bi-star");
                    s.classList.add("bi-star-fill");
                } else {
                    s.classList.remove("bi-star-fill");
                    s.classList.add("bi-star");
                }
            });
        });
    });
}

//Show map function
async function showMap(): Promise<void> {
    const restAdress = (await document.getElementById(
        "address"
    )) as HTMLInputElement;
    restAdress.textContent = restaurant.address;
    const coords: Coordinates = {
        latitude: restaurant.lat,
        longitude: restaurant.lng,
    };
    const mapService = new MapService(coords, "map");
    mapService.createMarker(coords);
}

//Show owner function
function showOwner(): void {
    //DOM elements
    const divName = document.getElementById("creatorName") as HTMLAnchorElement;
    const divEmail = document.getElementById("creatorEmail") as HTMLElement;
    const divImg = document.getElementById("creatorImg") as HTMLImageElement;
    // const cardBody = document.getElementById("cardBody") as HTMLElement;

    if (restaurant.creator) {
        const profileUrl = `profile.html?id=${restaurant.creator.id}`;

        divName.textContent = restaurant.creator.name;
        divName.href = profileUrl;
        divEmail.textContent = restaurant.creator.email;
        divImg.src = restaurant.creator.avatar;

        //Add event listeners to the elements to redirect to the creator profile
        divName.addEventListener('click', () => {
            window.location.href = profileUrl;
        });
    } else {
        console.error("Restaurant creator is undefined");
    }
}
