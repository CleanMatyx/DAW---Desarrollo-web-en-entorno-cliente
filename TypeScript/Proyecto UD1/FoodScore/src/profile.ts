//Classes imports
import { AuthService } from "./classes/auth-service";
import { MapService } from "./classes/map-service";
import { UserService } from "./classes/user-service";

//Interfaces imports
import { Coordinates } from "./interfaces/coordinates";
import { User } from "./interfaces/user";
import { Utils } from "./classes/utils-service";

//Services
const authService = new AuthService();
const userService = new UserService();

//Get the id from the URL
const id : number =parseInt(location.search.split("=")[1]);

//Get the user profile
const user = await userService.getProfile(id);

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

//Show user profile data in the page 
(document.querySelector("#avatar") as HTMLImageElement).src = user.avatar;
(document.querySelector("#name") as HTMLElement).textContent = user.name;
(document.querySelector("#email") as HTMLElement).textContent = user.email;

//Show the map
showMap(user);

//Event listener to update the photo
document.querySelector("#photoInput")?.addEventListener("change" , (event : Event) => {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    if (file) reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
        userService.savePhoto(reader.result as string).then(image => {
            (document.querySelector("#avatar") as HTMLImageElement).src = image;
            
            location.reload();
        })
        Utils.createSweetAlert("success", "Photo updated", "success");
    });
});

//Event listener to edit the profile data
(document.querySelector("#editProfile") as HTMLElement).addEventListener("click" , () => {
    (document.querySelector("#profileInfo") as HTMLElement).classList.add("d-none");
    (document.querySelector("#profileForm") as HTMLElement).classList.remove("d-none");
    (document.querySelector("#emailInput") as HTMLInputElement).value = user.email;
    (document.querySelector("#nameInput") as HTMLInputElement).value = user.name;
});

//Event listener to cancel the profile edition 
document.querySelector("#cancelEditProfile")?.addEventListener("click", () => {
    (document.querySelector("#profileInfo") as HTMLElement).classList.remove("d-none");
    (document.querySelector("#profileForm") as HTMLElement).classList.add("d-none");
});

//Event listener to submit the profile edition
(document.querySelector("form") as HTMLFormElement).addEventListener("submit" , e =>{
    e.preventDefault();

    const email = (document.querySelector("#emailInput") as HTMLInputElement).value;
    const name = (document.querySelector("#nameInput") as HTMLInputElement).value;

    userService.saveProfile(name , email).then(() => {
        (document.querySelector("#profileInfo") as HTMLElement).classList.remove("d-none");
        (document.querySelector("#profileForm") as HTMLElement).classList.add("d-none");
        (document.querySelector("#name") as HTMLElement).textContent = name;
        (document.querySelector("#email") as HTMLElement).textContent = email;
        Utils.createSweetAlert("success", "Profile updated", "success");
    });    
});

//Event listener to edit the password
(document.querySelector("#editPassword") as HTMLElement).addEventListener("click" , () => {
    (document.querySelector("#profileInfo") as HTMLElement).classList.add("d-none");
    (document.querySelector("#passwordForm") as HTMLElement).classList.remove("d-none");
});

//Event listener to cancel the password edition
(document.querySelector("#cancelEditPassword") as HTMLElement).addEventListener("click" , () => {
    (document.querySelector("#profileInfo") as HTMLElement).classList.remove("d-none");
    (document.querySelector("#passwordForm") as HTMLElement).classList.add("d-none");
});

//Event listener to submit the password edition
const divFormPasswd = document.querySelector("#passwordForm") as HTMLElement;

//Event listener to submit the password edition
(divFormPasswd.firstElementChild as HTMLFormElement).addEventListener("submit" , e => {
    e.preventDefault();
    const password = (document.querySelector("#password") as HTMLInputElement).value;
    const password2 = (document.querySelector("#password2") as HTMLInputElement).value;

    if (!password || !password2) {
        Utils.createSweetAlert("Error", "Password should not be empty", "error");
        return;
    }

    if(password === password2){
        userService.savePassword(password).then(() => {
            (document.querySelector("#profileInfo") as HTMLElement).classList.remove("d-none");
            (document.querySelector("#passwordForm") as HTMLElement).classList.add("d-none");
            Utils.createSweetAlert("success", "Password updated", "success");
        }).catch(() => {
            Utils.createSweetAlert("Error", "Error updating password", "error");
        })
    }else{
        Utils.createSweetAlert("Error", "Passwords do not match", "error");
    }
})

//Function to show the map
function showMap(user : User){
    const coordinates  = [user.lat ,user.lng];
    const [latitude , longitude] = coordinates;
    const coords : Coordinates = {latitude , longitude};
    const map = new MapService(coords, "map");
    map.createMarker(coords);
}