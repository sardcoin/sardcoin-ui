import {Component, OnDestroy, OnInit} from '@angular/core';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {isValidDate} from 'ngx-bootstrap/timepicker/timepicker.utils';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {StoreService} from '../../../../shared/_services/store.service';
import {QuantityCouponValidation} from '../coupon-create/validator/QuantityCouponValidation.directive';
import {environment} from '../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {Coupon} from '../../../../shared/_models/Coupon';
import {first} from 'rxjs/internal/operators';
import {DateValidation} from '../coupon-create/validator/DateValidation.directive';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './coupon-edit.component.html',
  styleUrls: ['./coupon-edit.component.scss'],
})

export class CouponEditComponent implements OnInit, OnDestroy {

  couponForm: FormGroup;

  markedUnlimited = false;
  markedFree = false;
  markedConstraints = false;
  markedVisibleFrom = false;
  markedQuantity = false;
  markedPrivate = false;

  bgColorCalendar = '#FFF';

  purchasable = 1;

  fromEdit = false;
  price = null;
  couponCopy: Coupon;
  idCopy = 0;
  coupon: any;
  couponPass: Coupon;
  submitted = false;
  imageURL = 'http://' + environment.host + ':' + environment.port + '/';
  URL = 'http://' + environment.host + ':' + environment.port + '/coupons/addImage';
  imagePath: string = null;

  public uploader: FileUploader = new FileUploader({
    url: this.URL,
    isHTML5: true,
    method: 'POST',
    itemAlias: 'file',
    authTokenHeader: 'authorization',
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
    this.couponService.currentMessage.subscribe(coupon => {
      this.couponPass = coupon;
      if (this.couponPass === null || this.couponPass === undefined) {
        this.router.navigate(['/reserved-area/producer/list']);
      }
    });
    this.couponService.checkFrom.subscribe(fromEdit => this.fromEdit = fromEdit);

  }

  ngOnInit() {
    // If the coupon passed does not exist, the user is been redirect to the list of coupons
    if (this.couponPass === null || this.couponPass === undefined) {
      this.router.navigate(['/reserved-area/producer/list']);
    }

    this.imageURL = this.imageURL + this.couponPass.image;
    const until = this.couponPass.valid_until === null ? '' : this.couponPass.valid_until;

    this.markedUnlimited = this.couponPass.valid_until === null;
    this.markedQuantity = this.couponPass.purchasable === null;
    this.bgColorCalendar = this.markedUnlimited ? '#E4E7EA' : '#FFF';

    this.couponForm = this.formBuilder.group({
      title:              [this.couponPass.title, Validators.compose([Validators.maxLength(40), Validators.minLength(5), Validators.required])],
      description:        [this.couponPass.description, Validators.compose([Validators.maxLength(200), Validators.minLength(5)])],
      image:              [],
      price:              [this.couponPass.price.toFixed(2), Validators.compose([Validators.required])],
      valid_until_empty:  [this.markedUnlimited],
      published_from:     [{value: this.markedVisibleFrom ? null : this.couponPass.visible_from, disabled: this.markedVisibleFrom}],
      valid_from:         [this.couponPass.valid_from, Validators.compose([Validators.required])],
      valid_until:        [{value: this.markedUnlimited ? null : until, disabled: this.markedUnlimited}],
      constraints:        [this.couponPass.constraints],
      quantity:           [{value: this.couponPass.quantity, disabled: true}],
      purchasable:        [{value: this.markedQuantity ? null : this.couponPass.purchasable, disabled: this.markedQuantity}, Validators.required]
    }, {
      validator: Validators.compose([DateValidation.CheckDateDay, QuantityCouponValidation.CheckQuantityCoupon])
    });

    this.addBreadcrumb();
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }


  get f() {
    return this.couponForm.controls;
  }

  saveChange() {
    const dateFrom = new Date(this.couponForm.value.valid_from);
    const dateUntil = this.couponForm.value.valid_until ? new Date(this.couponForm.value.valid_until) : null;

    this.submitted = true;

    if (this.couponForm.invalid) {
      return;
    }

    const coupon: Coupon = {
      id: this.couponPass.id,
      title: this.f.title.value,
      description: this.f.description.value,
      image: this.imagePath ? this.imagePath : this.couponPass.image,
      timestamp: this.couponPass.timestamp,
      price: this.markedFree ? 0 : this.f.price.value,
      visible_from: this.markedPrivate ? null : (new Date(this.f.published_from.value)).getTime().valueOf(),
      valid_from: (new Date(this.f.valid_from.value)).getTime().valueOf(),
      valid_until: this.markedUnlimited ? null : (new Date(this.f.valid_until.value)).getTime().valueOf(),
      constraints: this.markedConstraints ? null : this.f.constraints.value,
      purchasable: this.markedQuantity ? null : this.f.purchasable.value
    };

    this.couponService.editCoupon(coupon)
      .subscribe(data => {
        if (data['status']) {
          this.toastr.error('An error occurred while updating the coupon', 'Error on update');
        } else {
          this.toastr.success('', 'Coupon edited successfully!');
          this.router.navigate(['/reserved-area/producer/list']);
        }
      }, err => {
        console.log(err);
        this.toastr.error('An error occurred while updating the coupon', 'Error on update');
      });

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

  toggleCheckbox(e) {

    switch (e.srcElement.id) {

      case 'privateCheck':
        this.markedPrivate = e.target.checked;

        if (this.markedPrivate) {
          this.couponForm.get('published_from').disable();
        } else {
          this.couponForm.get('published_from').enable();
        }
        break;

      case 'freeCheck':
        this.markedFree = e.target.checked;
        this.price = 0;
        break;

      case 'unlimitedCheck':
        this.markedUnlimited = e.target.checked;

        if (this.markedUnlimited === true) {
          this.couponForm.get('valid_until').disable();
          this.bgColorCalendar = '#E4E7EA';
        } else {
          this.couponForm.get('valid_until').enable();
          this.bgColorCalendar = '#FFF';
        }

        delete this.couponForm.value.valid_until;
        this.couponForm.value.valid_until_empty = true;
        break;

      case 'constraintsCheck':
        this.markedConstraints = e.target.checked;
        this.couponForm.value.constraints = '';
        break;

      case 'quantityCheck':
        this.markedQuantity = e.target.checked;

        if (this.markedQuantity) {
          this.couponForm.get('purchasable').disable();
        } else {
          this.couponForm.get('purchasable').enable();
        }
        break;
    }
  }

  toastEdited() {
    this.toastr.success('Edited coupon', 'Coupon edited successfully');
  }

  couponCreateCopy() {

    this.couponCreate();
    // this.saveChange();
  }

  couponCreate() {
    if (this.fromEdit === false) {

      /*     this.dateFrom = new Date(this.couponForm.value.valid_from);
           this.dateUntil = new Date(this.couponForm.value.valid_until);

           if (!isValidDate(this.dateUntil)) {
             this.dateUntil = null;
           }
           this.submitted = true;
           if (this.couponForm.invalid) {
             console.log('coupon invalid');
             return;

           }
           if (this.markedUnlimited) {
             if (this.markedUnlimited) {
               this.couponForm.removeControl('valid_until');
               this.couponForm.removeControl('valid_until');
             }
           }
           for (let i = 0; i < this.couponForm.value.quantity; i++) {
             this.couponCopy = new Coupon(
               null,
               this.couponForm.value.title,
               this.couponForm.value.description,
               this.imagePath ? this.imagePath : this.couponPass.image,
               this.couponForm.value.timestamp,
               this.couponForm.value.price ? this.couponForm.value.price : 0,
               this.dateFrom.getTime().valueOf(),
               (this.markedUnlimited ? null : this.returnDateUntil(this.dateUntil)),
               this.marked4 ? 3 : 0,
               this.couponForm.value.constraints,
               this.couponForm.value.owner,
               this.couponForm.value.consumer,
               this.couponForm.value.quantity,
               this.couponForm.value.purchasable,
             );
             this.couponService.register(this.couponCopy).pipe(first())
               .subscribe(
                 data => {
                   // console.log('new coupon create', data);
                   this.idCopy = JSON.parse(JSON.stringify(data)).id;
                   // console.log('id', JSON.parse( JSON.stringify(data)).id);

                   this.router.navigate(['/reserved-area/producer/list']);

                 }, error => {
                   console.log(error);
                 }
               );
           }*/
    }
  }

  returnDateUntil(date) {
    if (!isValidDate(date)) {
      return null;
    } else {
      return date.getTime().valueOf();
    }

  }

}
