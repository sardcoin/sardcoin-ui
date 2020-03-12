import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StoreService} from './_services/store.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private localStorage: StoreService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tkn = this.localStorage.getToken();

    // //console.log('tkn: ' + tkn);

    if (tkn !== null) {
      const headers = request.headers
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${tkn}`);

      const cloneReq = request.clone({ headers });

      return next.handle(cloneReq);
    }

    return next.handle(request);

  }
}
