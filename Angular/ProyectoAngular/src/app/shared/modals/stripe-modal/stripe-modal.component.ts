import { CurrencyPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Appearance, StripeElementsOptions } from '@stripe/stripe-js';
import {
  StripeElementsDirective,
  StripePaymentElementComponent,
  injectStripe,
} from 'ngx-stripe';

@Component({
  selector: 'stipe-modal',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CurrencyPipe,
    StripeElementsDirective,
    StripePaymentElementComponent,
  ],
  templateUrl: './stripe-modal.component.html',
  styleUrl: './stripe-modal.component.css',
})
export class StripeModalComponent implements OnInit {
  @Input() price!: number;
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  paying = signal(false);
  activeModal = inject(NgbActiveModal);
  icon = faQuestionCircle;
  stripe = injectStripe(
    'pk_test_51OvJsD2MiEg3n1LuqQkpkEvXFGkfaz2MhSeB0jBkSCCmt8mvWMY0HqVv02AQnyXQuGfM63cmLBmXuVXc8plGi7jE00zZwpfLhY'
  );

  appearance: Appearance = {
    theme: 'stripe',
    labels: 'floating',
    variables: {
      colorPrimary: '#673ab7',
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  ngOnInit(): void {
    // No funciona, hace falta un servidor y he perdido muchas horas con esto y no lo he conseguido
    this.elementsOptions.clientSecret = '';
  }
}
