import { Directive, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';

declare var google:any;

@Directive({
  selector: '[google-place]'
})
export class GooglePlacesDirective implements OnInit {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  private element: HTMLInputElement;

  constructor(elRef: ElementRef) {
    // elRef will get a reference to the element where the directive is placed
    this.element = elRef.nativeElement;
  }

  ngOnInit() {
    const autocomplete = new google.maps.places.Autocomplete(this.element);

    // Event listener to monitor place changes in the input - Emit the new address object for the updated place
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      this.onSelect.emit(this.element['value']);
    });
  }
}
