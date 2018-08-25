import {Component, Directive, OnDestroy, OnInit} from '@angular/core';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {Coupon} from '../../../../shared/_models/Coupon';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DateFromValidation} from '../coupon-create/validator/DateFromValidation.directive';
import {isValidDate} from 'ngx-bootstrap/timepicker/timepicker.utils';
import {first} from 'rxjs/internal/operators';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {StoreService} from '../../../../shared/_services/store.service';
import {QuantityCouponValidation} from '../coupon-create/validator/QuantityCouponValidation.directive';
import {ImageValidation} from '../coupon-create/validator/ImageValidation.directive.';
import {FileUploadModule} from 'ng2-file-upload';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './coupon-edit.component.html',
  styleUrls: ['./coupon-edit.component.scss']
})

@Directive({ selector: '[ng2FileSelect]' })

export class CouponEditComponent implements OnInit, OnDestroy {

  couponForm: FormGroup;
  marked = false;
  theCheckbox = false;
  myDate: Date;
  coupon: {};
  couponPass: any = null;
  dateFrom: Date;
  dateUntil: Date;
  submitted = false;
  URLstring = 'http://localhost:3000/';
  URL = 'http://localhost:3000/coupons/addImage';
  imagePath: string = null;

  public uploader: FileUploader = new FileUploader({
    url: this.URL,
    authToken: 'Bearer ' + this.storeService.getToken(),
  });

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public couponService: CouponService,
    public storeService: StoreService,
    private breadcrumbActions: BreadcrumbActions
  ) {
    this.couponService.currentMessage.subscribe(coupon => this.couponPass = coupon);

    if (this.couponPass === null) {

      this.router.navigate(['/']);
      return;
    }
  }

  ngOnInit() {
    this.URLstring = this.URLstring + this.couponPass.image;
    this.myDate = new Date(this.couponPass.valid_from);
    const from = this.myDate.toISOString().substring(0, 23);
    this.myDate = new Date(this.couponPass.valid_until);
    let until = this.myDate.toISOString().substring(0, 23);
    if (until === '1970-01-01T00:00:00.000') {
      until = '';
    }
    const ownerId = parseInt(this.storeService.getId());

    this.couponForm = this.formBuilder.group({
      title: [this.couponPass.title, Validators.compose([Validators.maxLength(40), Validators.required])],
      description: [this.couponPass.description],
      image: [],
      price: [this.couponPass.price, Validators.compose([Validators.required])],
      valid_from: [from, Validators.compose([Validators.required])],
      valid_until: [until],
      state: ['1'],
      constraints: [this.couponPass.constraints],
      owner: [ownerId, Validators.compose([Validators.required])], // da settare l'owner che è quello che genera il coupon
      consumer: [],
      quantity: [this.couponPass.quantity, Validators.required],

      // consumer: ['2', Validators.compose([Validators.required])] //
    }, {
      validator: Validators.compose([DateFromValidation.CheckDateDay,  QuantityCouponValidation.CheckQuantityCoupon])
    });

    this.addBreadcrumb();
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }


  get f() {
    return this.couponForm.controls;
  }

  saveChange() {
    this.dateFrom = new Date(this.couponForm.value.valid_from);
    this.dateUntil = new Date(this.couponForm.value.valid_until);

    if (!isValidDate(this.dateUntil)) {
      this.dateUntil = new Date(0);
    }
    this.submitted = true;
    if (this.couponForm.invalid) {
      console.log('coupon invalid');
      return;

    }
    this.coupon = {'id': this.couponPass.valueOf().id,
      'title': this.couponForm.value.title,
      'description': this.couponForm.value.description === '' ? null : this.couponForm.value.description,
      'timestamp' : this.couponForm.value.timestamp,
      'image': this.imagePath ? this.imagePath : this.couponPass.image,
      'price' : this.couponForm.value.price,
      'valid_from' :  this.dateFrom.getTime().valueOf(),
      'valid_until' : this.dateUntil.getTime().valueOf(),
      'state' : this.couponForm.value.state,
      'constraints' : this.couponForm.value.constraints === '' ? null : this.couponForm.value.constraints,
      'owner' : this.couponForm.value.owner,
      'consumer': this.couponForm.value.consumer,
      'quantity': this.couponForm.value.quantity};


    console.log('coupon edit', this.coupon);
    this.couponService.editCoupon(this.coupon);
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Edit Coupon', '/reserved-area/edit/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const data = JSON.parse(response); // success server response
    this.imagePath = data.image;
    console.log(data);
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    // let error = JSON.parse(response); //error server response
    console.log(response);
    console.log(this.uploader.queue[0]);
  }

}
