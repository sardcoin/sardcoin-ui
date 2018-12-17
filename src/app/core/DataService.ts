import {HostListener, Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject(null);
  currentMessage = this.messageSource.asObservable();
  private messageClass = new BehaviorSubject(null);
  currentClass = this.messageClass.asObservable();
  constructor() { }

  changeMessage(message: boolean) {
    this.messageSource.next(message);
  }
  changeClass(cls: boolean) {
    this.messageClass.next(cls);
  }


}
