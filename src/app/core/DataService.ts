import {HostListener, Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  public hideSource = new BehaviorSubject<boolean>(null);
  private desktopMode = new BehaviorSubject<boolean>(null);
  constructor() { }

  changeHide(message: boolean) {
    this.hideSource.next(message);
  }
  changeView(cls: boolean) {
    this.desktopMode.next(cls);
  }


}
