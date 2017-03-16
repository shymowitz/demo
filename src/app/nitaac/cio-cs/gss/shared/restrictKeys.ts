import { Directive, Input, HostListener } from '@angular/core';

@Directive({
    selector: '[restrictKey]'
})
export class RestrictKeys {
    @Input('restrictKey') regex: string;
    
    @HostListener('keydown', ['$event']) keyDown(event) {
        let regex = new RegExp(this.regex);
        if (event.key === 'End' || event.key === 'Home' || event.key === 'Backspace' || event.key === 'Enter' || event.key === 'Tab' || event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            return;
        }
        if (!regex.test(event.key)) {
            event.preventDefault();

        }
    }
}