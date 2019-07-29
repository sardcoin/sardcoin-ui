import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class GlobalEventsManagerService {
  isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
  userType: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  hideSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  desktopMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  changeHide = (hide: boolean): void =>
    this.hideSource.next(hide);

  changeView = (desktop: boolean): void =>
    this.desktopMode.next(desktop);
}
