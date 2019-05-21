import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Credentials} from './login/login.model';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../../shared/store/model';
import {LoginActions} from './login/login.actions';
import {map} from 'rxjs/internal/operators';
import {environment} from '../../../environments/environment';
import {StoreService} from '../../shared/_services/store.service';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';

@Injectable()
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private ngRedux: NgRedux<IAppState>,
    private loginActions: LoginActions,
    private localService: StoreService,
    private GEmanager: GlobalEventsManagerService
  ) {
  }

  login(credentials: Credentials) {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic ' + btoa(credentials.username + ':' + credentials.password));

    const httpOptions = {
      headers: headers
    };

    return this.http.post<any>(environment.protocol + '://' + environment.host + ':' + environment.port + '/login', {}, httpOptions)
      .pipe(map(response => {

        if (response['user'] && response['token']) {
          this.loginActions.loginUserSuccess(response['user'], response['token']);
          // this.GEmanager.isUserLoggedIn.next(true);

          // TODO inserire switch su tipo user

          return response;
        } else {
          this.loginActions.loginUserError();
        }
      }));
  }

  logout() {
  }

}


