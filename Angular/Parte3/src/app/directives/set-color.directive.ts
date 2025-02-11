import { Directive, effect, ElementRef, inject, input, signal } from '@angular/core';

//indicar a qué elementos se le puede aplicar la directiva
// @Directive({
//   //selector: 'div.c {background-color: red;}' por ejemplo para aplicar a un div con clase c el color de fondo rojo
//   selector: '[setColor]'
// })
// export class SetColorDirective {
//   elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
//   bgColor = input.required<string>({alias: 'setColor'});

//   constructor() {
//     effect(() => {
//       this.elementRef.nativeElement.style.backgroundColor = this.bgColor();
//     });
//    }
// }

@Directive({
  selector: '[setColor]',
  host: {
    '[style.backgroundColor]': 'bgColor()',
    '[style.color]': "textColor()",
    '(click)': 'toggleTextColor()',
  }
})
export class SetColorDirective {
  bgColor = input.required<string>({alias: 'setColor'});
  textColor = signal('black');

  toggleTextColor() {
    this.textColor.update(c => c === 'black' ? 'white' : 'black');
  }
}
