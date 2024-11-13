import { RestaurantService } from './classes/restaurant-service.ts';

let arrayGlobalRestaurantes = [];
const restaurantsService = new RestaurantService();

// Cargar restaurantes al iniciar
async function init() {
    try {
        arrayGlobalRestaurantes = await restaurantsService.getAll();
        showRestaurants(arrayGlobalRestaurantes);
        setupSearchListener();
    } catch (error) {
        console.error('Error al cargar restaurantes:', error);
    }
}

// Función para configurar el listener del input de búsqueda
function setupSearchListener() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const filtered = filterRestaurants(e.target.value);
            showRestaurants(filtered);
        });
    }
}

// Función para filtrar restaurantes por nombre o descripción
function filterRestaurants(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    return arrayGlobalRestaurantes.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.description.toLowerCase().includes(searchTerm)
    );
}

async function handleDelete(id, cardElement) {
    console.log('Iniciando handleDelete con:', { id, cardElement });
    
    try {
        // Verificar que tenemos el servicio
        if (!restaurantsService) {
            throw new Error('restaurantsService no está definido');
        }

        if (confirm('¿Está seguro de que desea eliminar este restaurante?')) {
            // Intentar eliminar
            await restaurantsService.delete(id);

            // Actualizar array global
            arrayGlobalRestaurantes = arrayGlobalRestaurantes.filter(r => r.id !== id);

            // Eliminar del DOM
            cardElement.remove();
        }
    } catch (error) {
        console.error('Error en handleDelete:', error);
        alert('Error al eliminar el restaurante: ' + error.message);
    }
}

// Función para mostrar productos actualizada
function showRestaurants(restaurants) {
    const placesContainer = document.getElementById('placesContainer');
    const template = document.getElementById('restaurantTemplate');
    
    // Limpiar contenedor
    placesContainer.textContent = '';
    
    // Mapear días de la semana para mostrar
    const daysMap = {
        0: "Su",
        1: "Mo",
        2: "Tu",
        3: "We",
        4: "Th",
        5: "Fr",
        6: "Sa"
    };

    restaurants.forEach(restaurant => {
        try {
            const clone = template.content.cloneNode(true);
            const cardElement = clone.querySelector('.card');
            
            // Rellenar datos básicos
            clone.querySelector('.card-title').textContent = restaurant.name;
            clone.querySelector('.card-text').textContent = restaurant.description;
            
            // Rellenar días
            const daysElement = clone.querySelector('.text-muted strong').parentElement;
            if (restaurant.daysOpen) {
                const dayNames = restaurant.daysOpen.map(day => daysMap[day]);
                daysElement.textContent = `Días: ${dayNames.join(', ')}`;
            } else {
                daysElement.textContent = 'Días: No especificados';
            }
            
            // Rellenar teléfono
            const phoneElement = clone.querySelector('.phone');
            phoneElement.textContent = `Teléfono: ${restaurant.phone || 'No disponible'}`;
            
            // Configurar badges
            const openBadge = clone.querySelector('.badge.bg-success');
            const closedBadge = clone.querySelector('.badge.bg-danger');
            const isOpen = isRestaurantOpen(restaurant);
            openBadge.style.display = isOpen ? 'inline-block' : 'none';
            closedBadge.style.display = isOpen ? 'none' : 'inline-block';
            
            // Configurar imagen
            if (restaurant.image) {
                clone.querySelector('.card-img-top').src = restaurant.image;
            }

            // Configurar botón eliminar
            const deleteBtn = clone.querySelector('.delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDelete(restaurant.id, cardElement);
                });
            }

            // Rellenar tipo de cocina
            const footerElement = clone.querySelector('.card-footer .text-muted');
            footerElement.textContent = `${restaurant.cuisine || 'No especificada'}`;
            
            // Agregar al DOM
            placesContainer.appendChild(clone);
        } catch (error) {
            console.error('Error al mostrar restaurante:', error);
        }
    });
}

function isRestaurantOpen(restaurant) {
    // Validación inicial
    if (!restaurant || !restaurant.daysOpen || !Array.isArray(restaurant.daysOpen)) {
        return false;
    }

    const now = new Date();
    const currentDay = now.getDay().toString(); // Convertir a string para comparar
    
    return restaurant.daysOpen.includes(currentDay);
}

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', init);