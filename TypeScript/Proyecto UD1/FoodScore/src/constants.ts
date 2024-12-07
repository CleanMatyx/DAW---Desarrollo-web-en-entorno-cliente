export const SERVER = 'https://api.fullstackpro.es/foodscore';
export const RESTAURANTS_ENDPOINT = '/restaurants';
export const USER_LOGIN_ENDPOINT = '/auth/login';
export const USER_REGISTER_ENDPOINT = '/auth/register';
export const RESTAURANT_TEMPLATE = document.getElementById("restaurantTemplate") as HTMLTemplateElement;
export const FORM_RESTAURANT = document.getElementById('newRestaurant') as HTMLFormElement;
export const IMG_PREVIEW = document.getElementById("imgPreview") as HTMLImageElement;
export const DAYS_ERROR = document.getElementById("daysError");
export const NAME_REGEX = /^[A-Za-z][A-Za-z\s]*$/;
export const PHONE_REGEX = /^\d{9}$/;
export const WITHOUT_SPACE_REGEX = /^[A-Za-z][A-Za-z\s]+$/;
export const WEEKDAYS  = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
export const DIAS_SEMANA =["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
