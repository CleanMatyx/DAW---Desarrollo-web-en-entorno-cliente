import { ChangeDetectorRef, Component, inject} from '@angular/core';
import { FormsModule} from '@angular/forms';
import { Product } from '../interfaces/product';

@Component({
  selector: 'product-form',
  imports: [FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  // Quitamos el ouput 'add'
  newProduct: Product = {
    id: 0,
    description: '',
    available: '',
    imageUrl: '',
    rating: 1,
    price: 0,
  };

  #productsService = inject(ProductsService);
  #router = inject(Router);

  #changeDetector = inject(ChangeDetectorRef);

  // add = output<Product>();

  changeImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files?.length) return;
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('load', () => {
      this.newProduct.imageUrl = reader.result as string;
      this.#changeDetector.markForCheck();
    });
  }

  addProduct() { // No necesitamos el formulario (NgForm) para resetearlo
    this.#productsService
      .insertProduct(this.newProduct)
      .subscribe(() => this.#router.navigate(['/products']));
  }
}
