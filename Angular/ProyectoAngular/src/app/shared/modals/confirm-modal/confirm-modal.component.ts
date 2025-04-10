import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { Icons } from '../interfaces/icon';

@Component({
  selector: 'confirm-modal',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  type!: string;
  title!: string;
  body!: string;
  
  #faIconLibrary = inject(FaIconLibrary);
  activeModal = inject(NgbActiveModal);

  constructor() {
    this.#faIconLibrary.addIcons(faTriangleExclamation, faQuestionCircle);
  }
}
