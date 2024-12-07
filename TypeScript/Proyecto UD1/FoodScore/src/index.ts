import { RestaurantService } from './classes/restaurant-service.ts';
import { Restaurant } from './interfaces/restaurant.ts';
import { AuthService } from "./classes/auth-service";

const authService = new AuthService();
authService.checkToken();

let arrayGlobalRestaurantes: Restaurant[] = [];
const restaurantsService = new RestaurantService();
//If user is not logged, redirect to login page
if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

//Logout button
const logoutButton = document.querySelector("#logout");
if (logoutButton) {
    logoutButton.addEventListener("click", function () {
    authService.logout();
    });
}

const container = <HTMLDivElement>document.getElementById("placesContainer");
const loadMoreButton = document.getElementById('loadMore');

loadMoreButton?.addEventListener('click', async () => {
    restaurantsService.page++;
    const restaurantsList = await restaurantsService.getAll();
    showRestaurants(restaurantsList);
});

async function getRestaurants(): Promise<void> {
    arrayGlobalRestaurantes = await restaurantsService.getAll() as Restaurant[];
    showRestaurants(arrayGlobalRestaurantes);
}

function showRestaurants(restaurants: Restaurant[]): void {
    container.replaceChildren();
    checkIfMoreRestaurants();
    restaurants.forEach(restaurant => addRestaurantCard(restaurant));
}

getRestaurants();

//Funcion que crea la carta del restaurante que se a pasado por parametro
function addRestaurantCard(restaurant : Restaurant){
    const divElement : HTMLDivElement =  restaurantsService.restaurant2HTML(restaurant, async() => {
        if (restaurant.id !== undefined) {
            await restaurantsService.delete(restaurant.id);
        } else {
            console.error('Restaurant ID is undefined');
        }
        divElement.remove();
    });   
    
    container.append(divElement);
}   

function checkIfMoreRestaurants() {
    if(restaurantsService.more) {
        loadMoreButton!.classList.remove("d-none");
    } else {
        loadMoreButton!.classList.add("d-none");
    }
}