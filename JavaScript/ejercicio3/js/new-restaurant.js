import { RestaurantService } from './restaurant-service.class.js';

"use strict";

const formRestaurant = document.getElementById("newRestaurant");
const imgPreview = document.getElementById("imgPreview");
const daysError = document.getElementById("daysError");
const nameRegex = /^[A-Za-z][A-Za-z\s]*$/;
const phoneRegex = /^\d{9}$/;
const withoutSpaceRegex = /^[A-Za-z][A-Za-z\s]+$/;
const restaurantService = new RestaurantService();

function validateForm(form, name, nameRegex, description, cuisine, days, daysError, phone, phoneRegex, image) {
    let isValid = true;

    // Validar nombre
    if (!name || !nameRegex.test(name)) {
        form.name.classList.add('is-invalid');
        isValid = false;
    } else {
        form.name.classList.remove('is-invalid');
    }

    // Validar descripción
    if (!description || description.length < 10) {
        form.description.classList.add('is-invalid');
        isValid = false;
    } else {
        form.description.classList.remove('is-invalid');
    }

    // Validar cocina
    if (!cuisine || !withoutSpaceRegex.test(cuisine)) {
        form.cuisine.classList.add('is-invalid');
        isValid = false;
    } else {
        form.cuisine.classList.remove('is-invalid');
    }

    // Validar días
    if (days.length === 0) {
        daysError.style.display = 'block';
        isValid = false;
    } else {
        daysError.style.display = 'none';
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

formRestaurant.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = formRestaurant.name.value.trim();
    const description = formRestaurant.description.value.trim();
    const cuisine = formRestaurant.cuisine.value.trim();
    const days = Array.from(formRestaurant.days)
        .filter((i) => i.checked)
        .map(day => day.value);
    const phone = formRestaurant.phone.value.trim();
    const image = formRestaurant.image.files[0];

    if (validateForm(formRestaurant, name, nameRegex, description, cuisine, days, daysError, phone, phoneRegex, image)) {
        try {
            // Convertir imagen a base64
            const base64Image = await new Promise((resolve, reject) => {
                if (!image) {
                    reject(new Error('No se ha seleccionado ninguna imagen'));
                }
                
                const reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onload = () => {
                    // Extraer solo la parte base64 sin el prefijo data:image/*;base64,
                    const base64String = reader.result.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = error => reject(new Error(`Error al leer la imagen: ${error.message}`));
            });

            const restaurant = {
                title: name,
                description,
                cuisine,
                days,
                phone,
                image: base64Image
            };

            await restaurantService.post(restaurant);
            location.assign('index.html');
        } catch (error) {
            console.error('Error al crear restaurante:', error);
            alert(error.message || 'Error al crear el restaurante');
        }
    }
});

formRestaurant.image.addEventListener('change', event => {
    let file = event.target.files[0];
    let reader = new FileReader();
    if (file) reader.readAsDataURL(file);
    reader.addEventListener('load', e => {
        imgPreview.src = reader.result;
        imgPreview.classList.remove("d-none");
    });
});