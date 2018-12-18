import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/index';

@Injectable()
export class GlobalEventsManagerService {
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userType: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public hideSource = new BehaviorSubject<boolean>(true);
  public desktopMode = new BehaviorSubject<boolean>(true);


  changeHide(hide: boolean) {
    this.hideSource.next(hide);
  }
  changeView(desktop: boolean) {
    this.desktopMode.next(desktop);
  }
}
