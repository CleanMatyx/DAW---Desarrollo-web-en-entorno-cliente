import { Component, Input, inject } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() type!: string;
  @Input() title!: string;
  @Input() body!: string;

  icons: Icons = {
    warning: {
      color: 'text-warning',
      icon: ['fas', 'triangle-exclamation'],
    },
    question: {
      color: 'text-primary',
      icon: ['far', 'circle-question'],
    },
  };
  
  #faIconLibrary = inject(FaIconLibrary);
  activeModal = inject(NgbActiveModal);

  constructor() {
    this.#faIconLibrary.addIcons(faTriangleExclamation, faQuestionCircle);
  }
}
