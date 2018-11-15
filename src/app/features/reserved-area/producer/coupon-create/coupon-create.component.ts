import {Component, Directive, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Coupon} from '../../../../shared/_models/Coupon';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {first} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {DateFromValidation} from './validator/DateFromValidation.directive';
import {isValidDate} from 'ngx-bootstrap/timepicker/timepicker.utils';
import {StoreService} from '../../../../shared/_services/store.service';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {ImageValidation} from './validator/ImageValidation.directive.';
import {QuantityCouponValidation} from './validator/QuantityCouponValidation.directive';
import {environment} from '../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import { sha256, sha224 } from 'js-sha256';
import {FlatpickrOptions} from 'ng2-flatpickr';
import {} from 'flatpickr';

@Component({
  selector: 'app-feature-reserved-area-coupon-create',
  templateUrl: './coupon-create.component.html',
  styleUrls: ['./coupon-create.component.scss'],
})

export class FeatureReservedAreaCouponCreateComponent implements OnInit, OnDestroy {
  couponForm: FormGroup;
  date: FormGroup;
  marked = false; // settare sempre a false
  price = null;
  marked2 = false;
  marked3 = false;
  marked4 = false;
  markedQuantity = false;
  purchasable = 1;

  @ViewChild('datepicker') datepicker;
  selectedDate: Date = new Date();
  exampleOptions: FlatpickrOptions = {
    defaultDate: null,
    enableTime: true,
    noCalendar: false,
    clickOpens: true, // false for disable
    allowInput: false,
  };

  theCheckbox = false;
  coupon: Coupon;
  couponPass: Coupon = null;
  dateFrom: Date;
  dateUntil: Date;
  submitted = false;
  URL = 'http://' + environment.host + ':' + environment.port + '/coupons/addImage';
  imagePath = 'no_image.jpeg';

  public uploader: FileUploader = new FileUploader({
    url: this.URL,
    isHTML5: true,
    method: 'POST',
    itemAlias: 'file',
    authTokenHeader:  'authorization',
    authToken: 'Bearer ' + this.storeService.getToken()
  });

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public storeService: StoreService,
    public couponService: CouponService,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    // this.couponService.currentMessage.subscribe(coupon => this.couponPass = coupon);
    const ownerId = parseInt(this.storeService.getId(), 10);

    this.date = this.formBuilder.group({
      datetimePicker: [],
    });

    this.couponForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(40), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(255)])],
      image: [],
      price: [],
      valid_until_empty: [this.marked],
      valid_from: [new Date().toISOString().slice(0, 16), Validators.required],
      valid_until: [null],
      state: [this.marked4 ? 3 : 0],
      constraints: [],
      owner: [ownerId],
      consumer: [],
      quantity: [1, Validators.required],
      purchasable: [1, Validators.required]
    }, {
      validator: Validators.compose([DateFromValidation.CheckDateDay, QuantityCouponValidation.CheckQuantityCoupon])
    });

    this.addBreadcrumb();

    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

  }


  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  get f() {
    return this.couponForm.controls;
  }

  saveCoupon() {
    let register;
    this.dateFrom = new Date(this.couponForm.value.valid_from);
    this.dateUntil = new Date(this.couponForm.value.valid_until);

    // console.log(this.dateUntil.getMilliseconds());



    this.submitted = true;

    // stop here if form is invalid
    if (this.couponForm.invalid) {
      console.log('coupon invalid');
      console.log(this.marked);
      return;

    }
    if (this.couponForm.value.quantity === 1) {
      this.coupon = new Coupon(
        null,
        this.couponForm.value.title,
        this.couponForm.value.description === '' ? null : this.couponForm.value.description,
        this.imagePath ? this.imagePath : 'no_image.jpeg',
        this.couponForm.value.timestamp,
        this.couponForm.value.price ? this.couponForm.value.price : 0,
        this.dateFrom.getTime().valueOf(),
        (this.marked ? null : this.returnDateUntil(this.dateUntil)),
        this.marked4 ? 3 : 0,
        this.couponForm.value.constraints,
        this.couponForm.value.owner,
        this.couponForm.value.consumer,
        this.couponForm.value.quantity,
        this.couponForm.value.purchasable,
      );
      console.log('this.coupon', this.coupon);
      console.log('this.couponForm.value.purchasable', this.couponForm.value.purchasable);

      this.couponService.register(this.coupon).pipe(first())
        .subscribe(
          data => {

            // if ((i + 1) === quantityCoupon) {
            this.router.navigate(['/reserved-area/producer/list']);
            this.toastCreate();

            // }
          }, error => {
            console.log(error);
          }
        );
    } else {

      this.coupon = new Coupon(
        null,
        this.couponForm.value.title,
        this.couponForm.value.description === '' ? null : this.couponForm.value.description,
        this.imagePath ? this.imagePath : 'no_image.jpeg',
        this.couponForm.value.timestamp,
        this.couponForm.value.price ? this.couponForm.value.price : 0,
        this.dateFrom.getTime().valueOf(),
        (this.dateUntil.getMilliseconds() === 0 ? null : this.returnDateUntil(this.dateUntil)),
        this.marked4 ? 3 : 0,
        this.couponForm.value.constraints,
        this.couponForm.value.owner,
        this.couponForm.value.consumer,
        this.couponForm.value.quantity,
        this.couponForm.value.purchasable,
      );

      for (let i = 0 ; i < this.couponForm.value.quantity; i++) {
        register = this.couponService.register(this.coupon)
        .subscribe(
          data => {
            // if ((i + 1) === quantityCoupon) {
              if ( i === this.couponForm.value.quantity - 1) {
                this.router.navigate(['/reserved-area/producer/list']);
                this.toastCreate();
              }

            // }
          }, error => {
            console.log(error);
          }

        );
      }
    }

  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Producer', '/reserved-area/producer/'));
    bread.push(new Breadcrumb('Add new coupon', '/reserved-area/producer/create/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const data = JSON.parse(response); // success server response
    this.imagePath = data.image;
    // console.log(data);
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    // let error = JSON.parse(response); //error server response
    // console.log(response);
    // console.log(this.uploader.queue[0]);
  }

  toggleVisibilityExpiration(e) {
    this.marked = e.target.checked;
    console.log('toggleVisibilityExpiration', this.marked  )
    if (this.marked === true) {
      this.couponForm.get('valid_until').disable();
    } else {
      this.couponForm.get('valid_until').enable();

    }
  }

  toggleVisibilityPrice(e) {
    this.marked2 = e.target.checked;
    this.price = 0;
  }

  toggleVisibilityPlace(e) {
    this.marked3 = e.target.checked;
  }
  toastCreate() {
    this.toastr.success('Create coupon', 'Coupon created successfully');
  }

  generateToken(title: string) {

    return sha256(title);
}

  toggleVisibility(e) {
    this.marked4 = e.target.checked;
    console.log('visible', this.marked4);
  }

  toggleVisibilityQuatity(e) {
    this.markedQuantity = e.target.checked;
    if (e.target.checked) {
      this.couponForm.value.purchasable = this.couponForm.value.quantity;
      this.purchasable = this.couponForm.value.quantity;
      this.couponForm.controls.purchasable.setValue((this.couponForm.value.quantity));
      console.log('no limit', this.markedQuantity);
    } else {

    }
  }

  returnDateUntil(date) {
    if (!isValidDate(date)) {
      return null;
    } else {
      return date.getTime().valueOf();
    }

  }

  isMarked() {}
}


