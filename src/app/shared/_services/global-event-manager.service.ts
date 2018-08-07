import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/index";

@Injectable()
export class GlobalEventsManagerService {
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userType: BehaviorSubject<string> = new BehaviorSubject<string>(null);
}
