//Classes imports
import { RestaurantService } from './classes/restaurant-service.ts';
import { AuthService } from "./classes/auth-service";
import { SERVER } from './constants';
import { Http } from './classes/http.ts';

//Interfaces imports
import { Restaurant } from './interfaces/restaurant.ts';
import swal from 'sweetalert2';

const authService = new AuthService();
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const searchBtn = document.getElementById('searchBtn');
const container = <HTMLDivElement>document.getElementById("placesContainer");
const loadMoreButton = document.getElementById('loadMore');
const restaurantsService = new RestaurantService();
let currentPage = 1;

//Restaurant array
let arrayGlobalRestaurantes: Restaurant[] = [];
const http = new Http();

// //Check if token is valid
// authService.checkToken();

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

//Function that gets all the restaurants from the API
async function getRestaurants(): Promise<void> {
    arrayGlobalRestaurantes = await restaurantsService.getAll() as Restaurant[];
    showRestaurants(arrayGlobalRestaurantes);
}

//Function that shows the restaurants in the container
 function showRestaurants(restaurants: Restaurant[]): void {
     //container.replaceChildren();
     checkIfMoreRestaurants();
     restaurants.forEach(restaurant => addRestaurantCard(restaurant));
 }

//Call the function to get all the restaurants
getRestaurants();

//Function that adds a restaurant card to the container
function addRestaurantCard(restaurant : Restaurant){
    const divElement : HTMLDivElement =  restaurantsService.restaurant2HTML(restaurant, async() => {
        if (restaurant.id !== undefined) {
            const confirmed = await swal.fire({
                title: "¿Estás seguro?",
                text: "¿Estás seguro de que deseas eliminar este restaurante?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar",
            });

            if (confirmed.isConfirmed) {
                await restaurantsService.delete(restaurant.id);
                divElement.remove();
            }
        } else {
            console.error('Restaurant ID is undefined');
        }
    });
    // Append the div element to the container
    container.append(divElement);
}

//Function to check if there are more restaurants available
function checkIfMoreRestaurants(): void {
    const loadMoreButton = document.querySelector("#loadMoreButton");
    if (restaurantsService.hasMoreRestaurants()) {
        loadMoreButton?.classList.remove('hidden');
    } else {
        loadMoreButton?.classList.add('hidden');
    }
}

//Listener for the search button
searchBtn?.addEventListener('click', () => {
    filterRestaurants();
});

//Listener for the search input
searchInput?.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        filterRestaurants();
    }
});

// Function to filter the restaurants by name or description
 function filterRestaurants() {
     currentPage = 1;
     const searchText = searchInput.value.toLowerCase();
     const filterInfo = document.getElementById('filterInfo');
     if (filterInfo) {
         filterInfo.textContent = `Filtrando por: ${searchText}`;
     }
     loadRestaurants(searchText, currentPage, true);
 }

// Function to load more restaurants
function loadMoreRestaurants() {
    currentPage++;
    const searchText = searchInput.value.toLowerCase();
    loadRestaurants(searchText, currentPage, false);
}

// Function to load restaurants
async function loadRestaurants(search: string, page: number, replace: boolean) {
    const params = new URLSearchParams({ page: String(page), search });
    const url = `${SERVER}/restaurants?${params.toString()}`;
    const data = await http.get<{ restaurants: Restaurant[], count: number, page: number, more: boolean }>(url);

    // Replace the restaurants if the replace parameter is true
    if (replace) {
        container.innerHTML = '';
    }

    // Update the load more button by disabling it if there are no more restaurants
    if (loadMoreButton) {
        if (!data.more) {
            (loadMoreButton as HTMLButtonElement).classList.add('d-none');
        } else {
            (loadMoreButton as HTMLButtonElement).classList.remove('d-none');
        }
    }

    //Show the restaurants
    showRestaurants(data.restaurants);
}

// Listener for the search button
searchBtn?.addEventListener('click', () => {
    filterRestaurants();
});

// Listener for the search input
searchInput?.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        filterRestaurants();
    }
});

// Listener for the load more button
 loadMoreButton?.addEventListener('click', () => {
     loadMoreRestaurants();
});