import {Component, HostListener, OnInit} from '@angular/core';
import {GlobalEventsManagerService} from '../shared/_services/global-event-manager.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
})
export class FeatureComponent implements OnInit {

  @select(['login', 'isLogged']) loginData: Observable<boolean>;

  desktopMode: boolean;
  userType;
  // loginData;
  hide: boolean;
  width: string;
  authPage = true;

  constructor(
    private globalEventService: GlobalEventsManagerService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message
    });

    this.globalEventService.userType.subscribe(value => {
      this.userType = value;
    });


    // this.loginData = this.globalEventService.isUserLoggedIn.asObservable();
    this.isHide();
  }

  ngOnInit() {
    this.globalEventService.hideSource.subscribe(message => {
      this.hide = message;
      this.width = this.hide && (this.userType == '2' || !this.userType) ? '55px' : '230px';
    });

    this.authPage = this.router.url.includes('authentication');

    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.authPage = this.router.url.includes('authentication');
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isHide();
  }

  isHide() {
    const innerWidth = window.innerWidth;
    if (innerWidth < 768) {
      this.globalEventService.changeView(false);
    } else {
      this.globalEventService.changeView(true);
    }
  }


}
