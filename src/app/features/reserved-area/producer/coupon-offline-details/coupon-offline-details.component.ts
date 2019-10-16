import { select } from '@angular-redux/store';
import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { Img, PdfMakeWrapper, QR } from 'pdfmake-wrapper';
import { Txt } from 'pdfmake-wrapper';
import pdfFonts from 'pdfmake/build/vfs_fonts'; // fonts provided for pdfmake
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { CartItem, ITEM_TYPE } from '../../../../shared/_models/CartItem';
import { Coupon } from '../../../../shared/_models/Coupon';
import { CouponService } from '../../../../shared/_services/coupon.service';
import { GlobalEventsManagerService } from '../../../../shared/_services/global-event-manager.service';
import { PackageService } from '../../../../shared/_services/package.service';
import { StoreService } from '../../../../shared/_services/store.service';
import { UserService } from '../../../../shared/_services/user.service';
import { LoginState } from '../../../authentication/login/login.model';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-offline-details.component.html',
  styleUrls: ['./coupon-offline-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CouponOfflineDetailsComponent implements OnInit, OnDestroy {

  @select() login$: Observable<LoginState>;

  imageURL = environment.protocol + '://' + environment.host + ':' + environment.port + '/';
  modalRef: BsModalRef;
  myForm: FormGroup;
  couponPass: Coupon = null;
  isMax = false;
  producer = null;
  desktopMode: boolean;
  error404 = false;
  userType: number;
  isUserLoggedIn: boolean;
  couponsPackage = null;

  routeSubscription: Subscription;

  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private router: Router,
    private modalService: BsModalService,
    private localStore: StoreService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private globalEventService: GlobalEventsManagerService
  ) {
    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message;
    });

  }

  ngOnInit() {

    this.loadCoupon();
    this.addBreadcrumb();

      }

  loadCoupon() {
    this.couponService.currentMessage.subscribe(coupon => {
        this.couponPass = coupon;
        console.log('cp pass', this.couponPass);
        if (!this.couponPass) {
          this.router.navigate(['reserved-area/producer' + '/offline']);
        } else {
            this.getOwner();
        }
    });
  }

  ngOnDestroy(): void {
    this.breadcrumbActions.deleteBreadcrumb();
    this.couponService.setCoupon(undefined);
  }

  openModal(template: TemplateRef<any>) {

    if (this.couponPass.CouponTokens.length === 0) {
      this.toastr.error('Hai già venduto tutti i token per questo coupon o è esaurito.', 'Token terminati');

      return;
    }

    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  add() {
    if (!this.isMax) {
      this.myForm.controls.quantity.setValue((this.myForm.value.quantity + 1));
      this.isMax = this.myForm.value.quantity === this.couponPass.max_quantity;
    }
  }

  del() {
    this.myForm.controls.quantity.setValue((this.myForm.value.quantity - 1));
    this.isMax = false;
  }

  closeModal() {
    this.modalRef.hide();
  }

  getOwner() {

      this.userService.getProducerFromId(this.couponPass.owner).subscribe(user => {
          this.producer = user;
          this.couponService.setUserCoupon(this.producer);
      });
      this.couponService.setUserCoupon(this.producer);

  }

  formatPrice(price) {
    if (price === 0) {
      return 'Gratis';
    }

    return '€ ' + price.toFixed(2);
  }

  formatUntil(inputDate) {
    if (inputDate === null) {
      return 'senza scadenza';
    }

    const date = inputDate.toString().substring(0, inputDate.indexOf('T'));
    const time = inputDate.toString().substring(inputDate.indexOf('T') + 1, inputDate.indexOf('Z') - 4);

    return date + ' ' + time;
  }

  retry() {

    this.router.navigate(['reserved-area/producer' + '/offline']);
  }

  sell() {

      this.couponService.buyProducerTokensOfflineByToken(this.couponPass.CouponTokens[0].token, this.couponPass.id).subscribe(result => {

        if (true) {
            PdfMakeWrapper.setFonts(pdfFonts);

            const pdf = new PdfMakeWrapper();
            pdf.info({
                title: this.couponPass.title,
                author: 'pdfmake-wrapper',
                subject: this.couponPass.description
            });
            pdf.defaultStyle({
                alignment: 'center',
                italics: true,
                height: 10,
                fontSize: 20
            });
            // pdf.images({picture: await new Img(this.imageURL + this.couponPass.image).build()})
            const title = new Txt(this.couponPass.title).bold().fontSize(30).end;
            pdf.add(title);
            const companyText = this.producer.company_name
            const ownerCompany = new Txt(companyText).bold().color('blue').fontSize(20).end;
            pdf.add(ownerCompany);
            const constraints = new Txt(this.couponPass.constraints).color('transparent').bold().fontSize(15).end;
            pdf.add(constraints);


            pdf.add(' ');
            const description = new Txt(this.couponPass.description).fontSize(20).end;
            console.log('description', description);

            pdf.add(description);
            pdf.add(' ');
            const dateUntil = 'Scadenza: ' +  this.formatUntil(this.couponPass.valid_until);
            console.log('dateUntil', dateUntil);
            const validUntil = new Txt(dateUntil.toString()).fontSize(20).bold().end;
            console.log('validUntil', validUntil);

            pdf.add(validUntil);
            pdf.add(' ');
            const token = new Txt('Token: ' + this.couponPass.CouponTokens[0].token).end;

            pdf.add(token);
            pdf.add(' ');
            pdf.add(' ');

            const qrCode = new QR(this.couponPass.CouponTokens[0].token).fit(300).end;

            pdf.add(qrCode);
            pdf.create().download(this.couponPass.CouponTokens[0].token);
            this.toastr.success(this.couponPass.title, 'Token venduto');
            this.couponService.getProducerTokensOfflineById(this.couponPass.id).subscribe( tokens => {
              this.couponPass.CouponTokens = tokens;
            })
        } else {
            this.toastr.error('I tokens relativi a questo Coupon sono terminati', 'Token non venduto');

        }

     });

  }

  addBreadcrumb() {
    const bread = [] as Array<Breadcrumb>;

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Offline', '/offline'));
    this.breadcrumbActions.updateBreadcrumb(bread);
  }

}
