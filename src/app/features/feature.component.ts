import {Component, HostListener} from '@angular/core';
import {GlobalEventsManagerService} from '../shared/_services/global-event-manager.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
})
export class FeatureComponent{

  desktopMode: boolean;
  userLogged: boolean;
  loginData;

  constructor(
    private globalEventService: GlobalEventsManagerService,
  ){
    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message
    });

    this.loginData = this.globalEventService.isUserLoggedIn.asObservable();

    this.isHide();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isHide();
  }

  isHide() {
    const innerWidth = window.innerWidth;
    if (innerWidth < 768) {
      this.globalEventService.changeHide(true);
      this.globalEventService.changeView(false);
    } else {
      this.globalEventService.changeHide(false);
      this.globalEventService.changeView(true);
    }
  }
}
