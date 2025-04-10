import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Icons } from '../interfaces/icon';

@Component({
  selector: 'info-modal',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.css'
})
export class InfoModalComponent {
  @Input() type!: string;
  @Input() title!: string;
  @Input() body!: string;

  icons: Icons = {
    error: {
      color: 'text-danger',
      icon: ['fas', 'circle-xmark'],
    },
    success: {
      color: 'text-success',
      icon: ['far', 'circle-check'],
    },
  };

  get iconConfig() {
    return this.icons[this.type] || { color: '', icon: ['', ''] };
  }
  
  #faIconLibrary = inject(FaIconLibrary);
  activeModal = inject(NgbActiveModal);

  constructor() {
    this.#faIconLibrary.addIcons(faCircleXmark, faCircleCheck);
  }
}
