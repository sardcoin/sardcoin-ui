import {Component, Directive, OnDestroy, OnInit} from '@angular/core';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {isValidDate} from 'ngx-bootstrap/timepicker/timepicker.utils';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {StoreService} from '../../../../shared/_services/store.service';
import {QuantityCouponValidation} from '../coupon-create/validator/QuantityCouponValidation.directive';
import {DateEditValidation} from '../coupon-create/validator/DateEditValidation.directive';
import {environment} from '../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {Coupon} from '../../../../shared/_models/Coupon';
import {first} from 'rxjs/internal/operators';




@Component({
  selector: 'app-edit-coupon',
  templateUrl: './coupon-edit.component.html',
  styleUrls: ['./coupon-edit.component.scss'],
})

export class CouponEditComponent implements OnInit, OnDestroy {

  formSettings = {
    theme: 'mobiscroll'
  };

  getCouponsCreatedFromToken = new Array();

  couponForm: FormGroup;
  marked = false;
  marked2 = false;
  marked3 = false;
  fromEdit = false;
  price = null;
  couponCopy: Coupon;
  idCopy = 0;
  myDate: Date;
  coupon: any;
  couponPass: any = null;
  dateFrom: Date;
  dateUntil: Date;
  submitted = false;
  URLstring = 'http://' + environment.host + ':' + environment.port + '/';
  URL = 'http://' + environment.host + ':' + environment.port + '/coupons/addImage';
  imagePath: string = null;

  public uploader: FileUploader = new FileUploader({
    url: this.URL,
    isHTML5: true,
    method: 'POST',
    itemAlias: 'file',
    authTokenHeader:  'authorization',
    authToken: 'Bearer ' + this.storeService.getToken(),
  });

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public couponService: CouponService,
    public storeService: StoreService,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService
  ) {
    this.couponService.currentMessage.subscribe(coupon => this.couponPass = coupon);
    this.couponService.checkFrom.subscribe(fromEdit => this.fromEdit = fromEdit);

    if (this.couponPass === null) {

      this.router.navigate(['/']);
      return;
    }

  }

  ngOnInit() {

    // console.log('token', this.couponPass.token);
    this.URLstring = this.URLstring + this.couponPass.image;
    this.myDate = new Date(this.couponPass.valid_from);
    const from = this.myDate.toISOString().substring(0, 23);
    this.myDate = new Date(this.couponPass.valid_until);
    let until = this.myDate.toISOString().substring(0, 23);
    if (until === '1970-01-01T00:00:00.000') {
      until = '';
    }
    const ownerId = parseInt(this.storeService.getId(), 10);


    this.couponForm = this.formBuilder.group({
      title: [this.couponPass.title, Validators.compose([Validators.maxLength(40), Validators.required])],
      description: [this.couponPass.description],
      image: [],
      price: [this.couponPass.price, Validators.compose([Validators.required])],
      valid_from_old : from,
      valid_from: [from, Validators.compose([Validators.required])],
      valid_until: [until],
      state: ['1'],
      constraints: [this.couponPass.constraints],
      owner: [ownerId, Validators.compose([Validators.required])], // da settare l'owner che è quello che genera il coupon
      consumer: [],
      quantity: [this.couponPass.quantity, Validators.required],

      // consumer: ['2', Validators.compose([Validators.required])] //
    }, {
      validator: Validators.compose([DateEditValidation.CheckDateDay,  QuantityCouponValidation.CheckQuantityCoupon])
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
    if (Number(this.couponPass.quantity) === Number(this.couponForm.value.quantity)) {
      this.couponService.getCouponsCreatedFromToken(this.couponPass.token).subscribe(coupons => {
        this.getCouponsCreatedFromToken = JSON.parse(JSON.stringify(coupons));
        for (const i of this.getCouponsCreatedFromToken) {
          this.coupon = {
            'id': i.id,
            'title': this.couponForm.value.title,
            'description': this.couponForm.value.description === '' ? null : this.couponForm.value.description,
            'timestamp': this.couponForm.value.timestamp,
            'image': this.imagePath ? this.imagePath : this.couponPass.image,
            'price': this.price != null ? this.price : this.couponForm.value.price,
            'valid_from': this.dateFrom.getTime().valueOf(),
            'valid_until': this.marked ? 0 : this.dateUntil.getTime().valueOf(),
            'state': this.couponForm.value.state,
            'constraints': this.couponForm.value.constraints === '' ? null : this.couponForm.value.constraints,
            'owner': this.couponForm.value.owner,
            'consumer': this.couponForm.value.consumer,
          };

          this.couponService.editCoupon(this.coupon).subscribe(
            (data) => {
              this.router.navigate(['/reserved-area/producer/list']);
            }, error => {
              console.log(error);
            }
          );
        }
      });
    } else {

      this.couponService.getCouponsCreatedFromToken(this.couponPass.token).subscribe(coupons => {
        this.getCouponsCreatedFromToken = JSON.parse(JSON.stringify(coupons));
        for (const i of this.getCouponsCreatedFromToken) {
          this.couponService.deleteCoupon(i.id).subscribe();
        }
        for (let i = 0; i  < this.couponForm.value.quantity;  i ++) {
          this.coupon =  new Coupon(null, this.couponForm.value.title,
            this.couponForm.value.description === '' ? null : this.couponForm.value.description,
            this.imagePath ? this.imagePath : this.couponPass.image,
              this.couponForm.value.timestamp,
            this.price != null ? this.price : this.couponForm.value.price,
            this.dateFrom.getTime().valueOf(),
            this.marked ? 0 : this.dateUntil.getTime().valueOf(),
            this.couponForm.value.state,
            this.couponForm.value.constraints === '' ? null : this.couponForm.value.constraints,
            this.couponForm.value.owner,
            null);
          this.couponService.register(this.coupon).subscribe(() => {
            this.router.navigate(['/reserved-area/producer/list']);
          });
        }
      });


    }


    this.toastEdited();
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
    // console.log(data);
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    // let error = JSON.parse(response); //error server response
    // console.log(response);
    // console.log(this.uploader.queue[0]);
  }

  toggleVisibility(e) {
    this.marked = e.target.checked;
  }

  toggleVisibility2(e) {
    this.marked2 = e.target.checked;
    this.price = 0;

  }
  toggleVisibility3(e) {
    this.marked3 = e.target.checked;
    this.couponForm.value.constraints = '';
  }
  toastEdited() {
    this.toastr.success('Edited coupon', 'Coupon edited successfully');
  }

  couponCreateCopy() {

    this.couponCreate();
    this.saveChange();
  }

  couponCreate() {
    if (this.fromEdit === false) {

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
      this.couponCopy = new Coupon(
        this.couponForm.value.title,
        this.couponForm.value.description,
        this.imagePath ? this.imagePath : this.couponPass.image,
        this.couponForm.value.timestamp,
        this.couponForm.value.price ? this.couponForm.value.price : 0,
        this.dateFrom.getTime().valueOf(),
        (this.dateUntil.getMilliseconds() === 0 ? null : this.dateUntil.getTime().valueOf()),
        0,
        this.couponForm.value.constraints,
        this.couponForm.value.owner,
        this.couponForm.value.consumer,
        this.couponForm.value.quantity
      );
      this.couponService.register(this.couponCopy).pipe(first())
        .subscribe(
          data => {
            // console.log('new coupon create', data);
            this.idCopy = JSON.parse( JSON.stringify(data)).id;
            // console.log('id', JSON.parse( JSON.stringify(data)).id);
          }, error => {
            console.log(error);
          }
        );

    }
  }

}
