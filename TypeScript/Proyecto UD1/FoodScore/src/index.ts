import { RestaurantService } from './classes/restaurant-service.ts';
import { Restaurant } from './interfaces/restaurant.ts';

let arrayGlobalRestaurantes: Restaurant[] = [];
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
            const target = e.target as HTMLInputElement;
            const filtered = arrayGlobalRestaurantes;
            if (target) {
                const filtered = filterRestaurants(target.value);
                showRestaurants(filtered);
            }
            showRestaurants(filtered);
        });
    }
}

// Función para filtrar restaurantes por nombre o descripción
function filterRestaurants(searchTerm: string) {
    searchTerm = searchTerm.toLowerCase();
    return arrayGlobalRestaurantes.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.description.toLowerCase().includes(searchTerm)
    );
}

interface CardElement extends HTMLElement {
    querySelector(selector: string): HTMLElement;
}

async function handleDelete(id: number, cardElement: CardElement) {
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
        alert('Error al eliminar el restaurante: ' + (error as Error).message);
    }
}

// Función para mostrar productos actualizada
function showRestaurants(restaurants: Restaurant[]) {
    const placesContainer = document.getElementById('placesContainer');
    const template = document.getElementById('restaurantTemplate') as HTMLTemplateElement;
    
    // Limpiar contenedor
    placesContainer!.textContent = '';
    
    // Mapear días de la semana para mostrar
    //daysMap como objeto con clave string y valor string y así suplir el error de que no se puede acceder a la propiedad '0' de un objeto
    const daysMap: {[key: string]: string} = {
        0: "Dom",
        1: "Lun",
        2: "Mar",
        3: "Mie",
        4: "Jue",
        5: "Vie",
        6: "Sab"
    };

    restaurants.forEach(restaurant => {
        try {
            //clone como DocumentFragment
            const clone = template!.content.cloneNode(true) as DocumentFragment;
            //cardElement como DocumentFragment
            const cardElement = (clone as DocumentFragment).querySelector('.card') as CardElement;
            
            // Rellenar datos básicos
            //Añadido '!' ya que se que tiene valor
            clone.querySelector('.card-title')!.textContent = restaurant.name;
            clone.querySelector('.card-text')!.textContent = restaurant.description;
            
            // Rellenar días
            const daysElement = clone.querySelector('.text-muted strong')!.parentElement;
            if (restaurant.daysOpen) {
                const dayNames = restaurant.daysOpen.map(day => daysMap[day]);
                daysElement!.textContent = `Días: ${dayNames.join(', ')}`;
            } else {
                daysElement!.textContent = 'Días: No especificados';
            }
            
            // Rellenar teléfono
            const phoneElement = clone.querySelector('.phone');
            phoneElement!.textContent = `Teléfono: ${restaurant.phone || 'No disponible'}`;
            
            // Configurar badges
            const openBadge = clone.querySelector('.badge.bg-success') as HTMLElement;
            const closedBadge = clone.querySelector('.badge.bg-danger') as HTMLElement;
            const isOpen = isRestaurantOpen(restaurant);
            openBadge.style.display = isOpen ? 'inline-block' : 'none';
            closedBadge.style.display = isOpen ? 'none' : 'inline-block';
            
            // Configurar imagen
            if (restaurant.image) {
                (clone!.querySelector('.card-img-top') as HTMLImageElement).src = restaurant.image;
            }

            // Configurar botón eliminar
            const deleteBtn = clone.querySelector('.delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // Compruebo que cardElement no es null
                    if (cardElement) {
                        handleDelete(restaurant.id, cardElement);
                    }
                });
            }

            // Rellenar tipo de cocina
            const footerElement = clone.querySelector('.card-footer .text-muted');
            footerElement!.textContent = `${restaurant.cuisine || 'No especificada'}`;
            
            // Agregar al DOM
            placesContainer!.appendChild(clone);
        } catch (error) {
            console.error('Error al mostrar restaurante:', error);
        }
    });
}

function isRestaurantOpen(restaurant: Restaurant): boolean {
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