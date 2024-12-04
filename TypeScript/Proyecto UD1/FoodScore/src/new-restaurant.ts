import { RestaurantService } from './classes/restaurant-service.ts';
import { FormElements } from './interfaces/formElements.ts';
import { RestaurantInsert } from './interfaces/restaurant.ts';
import { FORM_RESTAURANT, IMG_PREVIEW, DAYS_ERROR, NAME_REGEX, PHONE_REGEX, WITHOUT_SPACE_REGEX } from './constants.ts';

const restaurantService = new RestaurantService();
const formRestaurant = document.getElementById("newRestaurant");

function validateForm(
    form: FormElements, 
    name: string, 
    nameRegex: RegExp, 
    description: string, 
    cuisine: string, 
    days: string[], 
    daysError: HTMLElement, 
    phone: string, 
    phoneRegex: RegExp, 
    image: File | null
): boolean {
    let isValid = true;

    // Validar nombre
    if (!name || !nameRegex.test(name)) {
        form.restaurantName.classList.add('is-invalid');
        isValid = false;
    } else {
        form.restaurantName.classList.remove('is-invalid');
    }

    // Validar descripción
    if (!description || description.length < 10) {
        form.description.classList.add('is-invalid');
        isValid = false;
    } else {
        form.description.classList.remove('is-invalid');
    }

    // Validar cocina
    if (!cuisine || !WITHOUT_SPACE_REGEX.test(cuisine)) {
        form.cuisine.classList.add('is-invalid');
        isValid = false;
    } else {
        form.cuisine.classList.remove('is-invalid');
    }

    // Validar días
    if (days.length === 0) {
        daysError.classList.remove('d-none');
        isValid = false;
    } else {
        daysError.classList.add('d-none');
    }

    // Validar teléfono
    if (!phone || !phoneRegex.test(phone)) {
        form.phone.classList.add('is-invalid');
        isValid = false;
    } else {
        form.phone.classList.remove('is-invalid');
    }

    // Validar imagen
    if (!image) {
        form.image.classList.add('is-invalid');
        isValid = false;
    } else {
        form.image.classList.remove('is-invalid');
    }

    return isValid;
}

// Evento submit del formulario
if (formRestaurant) {
    formRestaurant.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    
    const form = FORM_RESTAURANT as unknown as FormElements;
    const name = form.restaurantName.value.trim();
    const description = form.description.value.trim();
    const cuisine = form.cuisine.value.trim();
    const days = Array.from(form.days)
        .filter((i) => i.checked)
        .map(day => day.value);
    const phone = form.phone.value.trim();
    const image = form.image.files ? form.image.files[0] : null;

    if (DAYS_ERROR && validateForm(form, name, NAME_REGEX, description, cuisine, days, DAYS_ERROR, phone, PHONE_REGEX, image)) {
        try {
            // Convertir imagen a base64
            const base64Image = await new Promise<string>((resolve, reject) => {
                if (!image) {
                    reject(new Error('No se ha seleccionado ninguna imagen'));
                }
                
                const reader = new FileReader();
                if (image) {
                    reader.readAsDataURL(image);
                } else {
                    reject(new Error('No se ha seleccionado ninguna imagen'));
                }
                reader.onload = () => {
                    // Extraer solo la parte base64 sin el prefijo data:image/*;base64,
                    const base64String = (reader.result as string).split(',')[1];
                    resolve(base64String);
                };
            });
            
            const restaurant: RestaurantInsert = {
                name: name,
                description: description,
                cuisine: cuisine,
                daysOpen: days,
                image: base64Image,
                phone: phone,
                address: '',
                lat: 0,
                lng: 0
            };

            await restaurantService.post(restaurant);
            location.assign('index.html');
        } catch (error) {
            console.error('Error al crear restaurante:', error);
            alert((error as Error).message || 'Error al crear el restaurante');
        }
    }
});
if(FORM_RESTAURANT) {
    (FORM_RESTAURANT as unknown as FormElements).image.addEventListener('change', (event: Event) => {
        const input = event.target as HTMLInputElement;
        const file = input.files ? input.files[0] : null;
        const reader = new FileReader();
    
        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                if (IMG_PREVIEW) {
                    (IMG_PREVIEW as HTMLImageElement).src = reader.result as string;
                    IMG_PREVIEW.classList.remove("d-none");
                }
            });
        }
    });
    }
}