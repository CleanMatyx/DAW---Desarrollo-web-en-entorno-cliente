import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RestaurantsService } from '../services/restaurants.service';
import { ProfilesService } from '../../profile/services/profiles.service';
import { User } from '../interfaces/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'restaurants-page',
  imports: [
    FormsModule, 
    RestaurantCardComponent
  ],
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.css',
})
export class RestaurantsPageComponent {
  #restaurantsService = inject(RestaurantsService);
  #profilesService = inject(ProfilesService);
  #activatedRoute = inject(ActivatedRoute);

  // Signals para el id y el nombre del creador
  creatorId = signal<string | null>(null);
  userName = signal('');

  // Signals para los parámetros de filtrado
  search = signal('');
  onlyOpen = signal(false);
  page = signal(1);
  creator = signal<string | null>(null);
  user: User | null = null;

  // Debounce del valor de búsqueda (se actualiza después de 600ms sin cambios)
  searchDebounced = toSignal(
    toObservable(this.search).pipe(debounceTime(600), distinctUntilChanged())
  );

  // Signal que almacenará el listado de restaurantes
  restaurants = signal<Restaurant[]>([]);

  constructor() {
    // Suscribirse a los query params para obtener el id del creador
    this.#activatedRoute.queryParams.subscribe(params => {
      if (params['creator']) {
        this.creator.set(params['creator']);
        // Llamar al servicio de perfiles para obtener los datos del usuario
        this.#profilesService.getProfile(params['creator']).subscribe({
          next: (profile: User) => {
            // Asignamos el nombre del usuario al signal userName para mostrarlo en la UI
            this.userName.set(profile.name);
          },
          error: err => {
            console.error('Error fetching user profile:', err);
            this.userName.set('');
          }
        });
      } else {
        this.creator.set(null);
        this.userName.set('');
      }
    });

    // Effect para recargar restaurantes cada vez que cambie alguno de los filtros
    effect(() => {
      // Se leen los valores actuales: search (debounciado), solo abiertos, página y creator
      const currentSearch = this.searchDebounced();
      const currentOnlyOpen = this.onlyOpen();
      const currentPage = this.page();
      const currentCreator = this.creator();

      console.log('Parámetros de búsqueda:', {
        page: currentPage,
        search: currentSearch,
        open: currentOnlyOpen ? 1 : 0,
        creator: currentCreator
      });

      // Construcción de los parámetros a enviar al servicio
      // Si onlyOpen es true, enviamos open=1; de lo contrario, enviamos open=0
      const params: any = {
        page: currentPage,
        search: currentSearch,
        open: currentOnlyOpen ? 1 : 0,
      };

      // Si se especifica creator, lo agregamos a los parámetros
      if (currentCreator) {
        params.creator = currentCreator;
      }

      // Llamada al servicio web con los filtros actuales
      this.#restaurantsService.getAll(params).subscribe({
        next: (result: Restaurant[]) => {
          // Si page es 1, se reemplaza el listado; si es mayor, se concatenan los resultados.
          if (currentPage === 1) {
            this.restaurants.set(result);
          } else {
            this.restaurants.update(old => old.concat(result));
          }
        },
        error: err => console.error('Error fetching restaurants', err),
      });
    });
  }

  /**
   * Método para actualizar el valor de búsqueda.
   * Se reinicia la página a 1 cada vez que se cambia este parámetro.
   */
  onSearchChange(value: string) {
    this.search.set(value);
    this.page.set(1); // Reinicia la página cuando se modifica la búsqueda.
  }

  /**
   * Método para actualizar el valor del filtro “solo abiertos”.
   * Reinicia la página a 1 al cambiar este valor.
   */
  onOnlyOpenChange(value: boolean) {
    this.onlyOpen.set(value);
    this.page.set(1); // Reinicia la página cuando se modifica el filtro de "open".
  }

  /**
   * Método para cargar la siguiente página de resultados, concatenándolos
   * al listado actual.
   */
  loadNextPage() {
    this.page.update(p => p + 1);
  }

  /**
   * Se usa para agregar un restaurante al listado (por ejemplo, tras la creación)
   */
  addRestaurant(restaurant: Restaurant) {
    this.restaurants.update(old => old.concat(restaurant));
  }

  /**
   * Método para eliminar un restaurante del listado.
   */
  deleteRestaurant(restaurant: Restaurant) {
    this.restaurants.update(old => old.filter(r => r !== restaurant));
  }
}