"use strict";

const formRestaurant = document.getElementById("newRestaurant");
const imgPreview = document.getElementById("imgPreview");
const placesContainer = document.getElementById("placesContainer");
const daysError = document.getElementById("daysError");

formRestaurant.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = formRestaurant.name.value.trim();
    const description = formRestaurant.description.value.trim();
    const cuisine = formRestaurant.cuisine.value.trim();
    const days = Array.from(formRestaurant.days)
        .filter((i) => i.checked);
    const phone = formRestaurant.phone.value.trim();
    const image = formRestaurant.image.files[0];
    const nameRegex = /^[A-Za-z][A-Za-z\s]*$/;
    const phoneRegex = /^\d{9}$/;
    const withoutSpaceRegex = /^[A-Za-z][A-Za-z\s]+$/;
    
    function validateForm(formRestaurant, name, nameRegex, description, cuisine, days, daysError, phone, phoneRegex, image) {
        let isValid = true;
    
        isValid = validateField(formRestaurant.name, name, nameRegex) && isValid;
        isValid = validateField(formRestaurant.description, description, withoutSpaceRegex) && isValid;
        isValid = validateField(formRestaurant.cuisine, cuisine, withoutSpaceRegex) && isValid;
        isValid = validateDays(days, daysError) && isValid;
        isValid = validateField(formRestaurant.phone, phone, phoneRegex) && isValid;
        isValid = validateField(formRestaurant.image, image, null) && isValid;
    
        return isValid;
    }
    
    function validateField(field, value, regex) {
        if (!value || (regex && !regex.test(value))) { // si regex = null sólo comprueba que no esté el campo vacío
            field.classList.add("is-invalid");
            field.classList.remove("is-valid");
            return false;
        } else {
            field.classList.add("is-valid");
            field.classList.remove("is-invalid");
            return true;
        }
    }
    
    function validateDays(days, daysError) {
        if (days.length === 0) {
            daysError.classList.remove("d-none");
            return false;
        } else {
            daysError.classList.add("d-none");
            return true;
        }
    }
    
    const isValid = validateForm(formRestaurant, name, nameRegex, description, cuisine, days, daysError, phone, phoneRegex, image);

    if (isValid) {
        const clone = cFillTemplate(imgPreview, name, description, days, phone, cuisine);
        placesContainer.appendChild(clone);
        resetForm(formRestaurant, imgPreview);
    }

    function cFillTemplate(imgPreview, name, description, days, phone, cuisine) {
        const template = document.getElementById('restaurant-card-template');
        const clone = template.content.cloneNode(true);
    
        clone.querySelector('.card-img-top').src = imgPreview.src;
        clone.querySelector('.card-title').textContent = name;
        clone.querySelector('.card-text').textContent = description;
    
        const daysText = getDaysText(days);
        clone.querySelector('.days-text').textContent = daysText;
    
        const spanBadge = clone.querySelector('.badge');
        updateBadge(spanBadge, days);
    
        clone.querySelector('.phone-text').textContent = phone;
        clone.querySelector('.cuisine-text').textContent = cuisine;
    
        return clone;
    }
    
    function getDaysText(days) {
        const dayNames = {
            0: "Su",
            1: "Mo",
            2: "Tu",
            3: "We",
            4: "Th",
            5: "Fr",
            6: "Sa"
        };
        return days.map((i) => dayNames[i.value]).join(", ");
    }
    
    function updateBadge(spanBadge, days) {
        const today = new Date().getDay();
        if (days.some(day => parseInt(day.value) === today)) {
            spanBadge.classList.add("bg-success");
            spanBadge.textContent = "Abierto";
        } else {
            spanBadge.classList.add("bg-danger");
            spanBadge.textContent = "Cerrado";
        }
    }
    
    function resetForm(formRestaurant, imgPreview) {
        formRestaurant.reset();
        imgPreview.src = "";
        imgPreview.classList.add("d-none");
        formRestaurant.name.classList.remove("is-valid");
        formRestaurant.description.classList.remove("is-valid");
        formRestaurant.cuisine.classList.remove("is-valid");
        formRestaurant.phone.classList.remove("is-valid");
        formRestaurant.image.classList.remove("is-valid");
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