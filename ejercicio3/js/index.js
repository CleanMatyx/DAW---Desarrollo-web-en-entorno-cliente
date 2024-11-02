import { RestaurantService } from './restaurant-service.class.js';

let arrayGlobalRestaurantes = [];
const restaurantsService = new RestaurantService();

// Cargar restaurantes al iniciar
async function init() {
    try {
        arrayGlobalRestaurantes = await restaurantsService.getAll();
        showProducts(arrayGlobalRestaurantes);
        setupSearchListener();
    } catch (error) {
        console.error('Error al cargar restaurantes:', error);
    }
}

function setupSearchListener() {
    const searchInput = document.querySelector('#search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const filtered = filterRestaurants(e.target.value);
            showProducts(filtered);
        });
    }
}

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
            // Encontrar el restaurante antes de eliminarlo
            const restaurante = arrayGlobalRestaurantes.find(r => r.id === id);
            console.log('Restaurante a eliminar:', restaurante);

            // Intentar eliminar
            await restaurantsService.delete(id);
            console.log('Restaurante eliminado en el servidor');

            // Actualizar array global
            arrayGlobalRestaurantes = arrayGlobalRestaurantes.filter(r => r.id !== id);
            console.log('Array global actualizado');

            // Eliminar del DOM
            cardElement.remove();
            console.log('Elemento eliminado del DOM');
        }
    } catch (error) {
        console.error('Error en handleDelete:', error);
        alert('Error al eliminar el restaurante: ' + error.message);
    }
}

function showProducts(products) {
    const placesContainer = document.querySelector('#placesContainer');
    const template = document.querySelector('#restaurantTemplate');
    
    placesContainer.textContent = '';
    
    products.forEach(product => {
        try {
            const clone = template.content.cloneNode(true);
            const cardElement = clone.querySelector('.card');
            
            // Obtener el botón delete existente
            const deleteBtn = clone.querySelector('.delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('Click en botón delete');
                    handleDelete(product.id, cardElement);
                });
            }

            // Imagen
            const imgElement = clone.querySelector('.card-img-top');
            if (imgElement && product.image) {
                imgElement.src = product.image.startsWith('http') 
                    ? product.image 
                    : `data:image/jpeg;base64,${product.image}`;
                imgElement.alt = product.name;
            }

            // Título y descripción
            clone.querySelector('.card-title').textContent = product.name;
            clone.querySelector('.card-text').textContent = product.description;

            placesContainer.appendChild(clone);
            console.log(product.name +' Tarjeta añadida al DOM');
        } catch (error) {
            console.error('Error al mostrar restaurante:', error);
        }
    });
}

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', init);