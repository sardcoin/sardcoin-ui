import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Coupon} from '../_models/Coupon';

@Injectable()
export class GlobalEventsManagerService {
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userType: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public hideSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public desktopMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public searchedCoupons: BehaviorSubject<Coupon[]> = new BehaviorSubject<Coupon[]>(null);

  changeHide(hide: boolean) {
    this.hideSource.next(hide);
  }
  changeView(desktop: boolean) {
    this.desktopMode.next(desktop);
  }
}
