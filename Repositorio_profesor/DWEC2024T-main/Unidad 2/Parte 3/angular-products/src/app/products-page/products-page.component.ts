import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Product } from '../interfaces/product';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'products-page',
  imports: [FormsModule, ProductItemComponent, ProductFormComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
})
export class ProductsPageComponent {
  #productsService = inject(ProductsService);

  productsResource = rxResource({
    loader: () => this.#productsService.getProducts()
  });

  showImage = signal(true);
  search = signal('');

  productsFiltered = computed(() =>
    this.productsResource.value()?.filter((p) =>
      p.description.toLowerCase().includes(this.search().toLowerCase())
    ) ?? []
  );

  constructor() {
    effect(() =>
      console.log('Imágenes visibles: ' + (this.showImage() ? 'sí' : 'no'))
    );
  }

  toggleImage() {
    this.showImage.update((show) => !show);
  }

  addProduct(product: Product) {
    this.productsResource.update((products) => products?.concat(product));
  }

  deleteProduct(product: Product) {
    this.productsResource.update((products) => products?.filter((p) => p !== product));
  }
}
