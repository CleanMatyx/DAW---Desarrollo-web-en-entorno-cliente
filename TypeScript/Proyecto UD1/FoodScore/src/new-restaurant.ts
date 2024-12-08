"use strict";

//Classes imports
import { RestaurantService } from './classes/restaurant-service.ts';
import { RestaurantInsert } from './interfaces/restaurant.ts';
import { AuthService } from './classes/auth-service.ts';

//Map imports
import { MapService } from './classes/map-service.ts';
import { MyGeolocation } from './classes/my-geolocation.ts';
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { Point } from "ol/geom";

//Constants
import { FORM_RESTAURANT, IMG_PREVIEW } from './constants.ts';
import { Utils } from "./classes/utils-service.ts";

//Services
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
//Restaurant form
const form = FORM_RESTAURANT;

// const restaurantService = new RestaurantService();

// Add event listener to the form to handle the image preview
const imgPreview = IMG_PREVIEW;
Utils.imagePreview(form.image as HTMLInputElement);

//Map service
let latitude: number;
let longitude: number;

//Show the map and the autocomplete
async function showMap(): Promise<void> {
    //Assing the current location to the map
    const currentUserLocation = await MyGeolocation.getLocation();
    const mapService = new MapService(currentUserLocation, "map");
    const marker = mapService.createMarker(currentUserLocation);
    const autocomplete = new GeocoderAutocomplete(document.querySelector("#autocomplete")!,
        "2fffc31efada4e81b10675e9a7e5d5bc", { lang: "es", debounceDelay: 600 });
    
        latitude = currentUserLocation.latitude;
        longitude = currentUserLocation.longitude;
    
        const mapView = mapService.view;
    
        autocomplete.on("select", (location) => {
            [latitude, longitude] = location.geometry.coordinates;
            marker.setGeometry(new Point([latitude, longitude]));
            mapView.setCenter([latitude, longitude]);
        });
}
    
//Show the map then add the event listener to the form
showMap().then(() => {
    const restaurantService = new RestaurantService();
    form.addEventListener('submit', async event => {
        event.preventDefault();

        //Check the days
        const checkedDays = Array.from(form.days as NodeListOf<HTMLInputElement>)
            .filter((input: HTMLInputElement) => input.checked)
            .map((input: HTMLInputElement) => input.value + "");

        const address = (document.querySelector(".geoapify-autocomplete-input") as HTMLInputElement).value;

        //Check fields
        const formValideFields = new Utils;
        const validations: { [key: string]: boolean } = {
            "name": formValideFields.validateName(form),
            "description": formValideFields.validateDescription(form),
            "phone": formValideFields.validatePhone(form),
            "cuisine": formValideFields.validateCuisine(form),
            "days" : formValideFields.validateDays(checkedDays),
            "image": formValideFields.validateImage(form)
        };

        //Check if all the fields are valid
        if (Object.values(validations).every(value => value)) {
            //Create the restaurant object
            const newRestaurant: RestaurantInsert = {
                name: (form.name as unknown as HTMLInputElement).value,
                description: form.description.value,
                daysOpen: checkedDays,
                cuisine: form.cuisine.value,
                phone: form.phone.value,
                address: address,
                lat: latitude,
                lng: longitude,
                image: imgPreview.src
            };

            //Post the restaurant
            await restaurantService.post(newRestaurant).then(() => {
                console.log("El restaurante a sido insertado");
                location.assign("index.html");
            }).catch(error =>{
                confirm((error.message as string));
            });
        }
    });
});