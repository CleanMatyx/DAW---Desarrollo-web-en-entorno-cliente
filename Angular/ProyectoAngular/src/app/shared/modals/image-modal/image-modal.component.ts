import { Component, Input, inject } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'image-modal',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css'
})
export class ImageModalComponent {
  @Input() title!: string;
  @Input() image!: string;
  
  #faIconLibrary = inject(FaIconLibrary);
  activeModal = inject(NgbActiveModal);

  constructor() {
    this.#faIconLibrary.addIcons(faQuestionCircle);
  }
}
