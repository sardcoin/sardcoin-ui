import {Component, OnInit} from '@angular/core';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';

@Component({
  selector: 'app-core-footer',
  templateUrl: './footer.component.html',
})

export class FooterComponent  {
  copyrightYear = new Date().getFullYear();

  isHide: boolean;
  isDesktop: boolean;

  constructor (
    private globalEventService: GlobalEventsManagerService
  ){
    this.globalEventService.hideSource.subscribe(message => this.isHide = message);
    this.globalEventService.desktopMode.subscribe(message => this.isDesktop = message);
  }

}
