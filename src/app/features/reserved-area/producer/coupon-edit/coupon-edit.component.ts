import {Component, Directive, OnDestroy, OnInit} from '@angular/core';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import {DateFromValidation} from '../coupon-create/validator/DateFromValidation.directive';




@Component({
  selector: 'app-edit-coupon',
  templateUrl: './coupon-edit.component.html',
  styleUrls: ['./coupon-edit.component.scss'],
})

export class CouponEditComponent implements OnInit, OnDestroy {

  formSettings = {
    theme: 'mobiscroll'
  };

  getCouponsCreatedFromTitleDescriptionPrice = new Array();

  couponForm: FormGroup;
  marked = false;
  marked2 = false;
  marked3 = false;
  marked4 = false;

  markedQuantity = false;
  purchasable = 1;

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
    this.couponService.currentMessage.subscribe(coupon => {this.couponPass = coupon
      if (this.couponPass === null || this.couponPass === undefined) {
      console.log('couponPass', this.couponPass);
        this.router.navigate(['/reserved-area/producer/list']);
      }});
    this.couponService.checkFrom.subscribe(fromEdit => this.fromEdit = fromEdit);

  }

  ngOnInit() {
    if (this.couponPass === null || this.couponPass === undefined) {
      console.log('couponPass', this.couponPass);
      this.router.navigate(['/reserved-area/producer/list']);
    }

    this.URLstring = this.URLstring + this.couponPass.image;
    this.myDate = new Date(this.couponPass.valid_from);
    const from = this.myDate.toISOString().substring(0, 23);
    this.myDate = new Date(this.couponPass.valid_until);
    let until = this.myDate.toISOString().substring(0, 23);
    if (this.couponPass.valid_until === null) {
      until = '';
    }
    const ownerId = parseInt(this.storeService.getId(), 10);


    this.couponForm = this.formBuilder.group({
      title: [this.couponPass.title, Validators.compose([Validators.maxLength(40), Validators.minLength(5), Validators.required])],
      description: [this.couponPass.description   , Validators.compose([Validators.maxLength(200), Validators.minLength(5)])],
      image: [],
      price: [this.couponPass.price.toFixed(2), Validators.compose([Validators.required])],
      valid_from_old : from,
      valid_until_empty: [this.marked],
      valid_from: [from, Validators.compose([Validators.required])],
      valid_until: [this.marked ? null : until ],
      state: [this.marked4 ? 3 : 0],
      constraints: [this.couponPass.constraints],
      owner: [ownerId, Validators.compose([Validators.required])], // da settare l'owner che è quello che genera il coupon
      consumer: [],
      quantity: [this.couponPass.quantity, Validators.required],
      purchasable: [this.couponPass.purchasable, Validators.required]


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
    console.log('this.couponForm.value.valid_until', this.couponForm.value.valid_until);

    if (!isValidDate(this.dateUntil)) {
      this.dateUntil = null;
    }


    this.submitted = true;


    if (this.couponForm.invalid) {
      console.log('coupon invalid', this.couponForm);
      return;

    }
    // console.log('this.couponPass.quantity', this.couponPass.quantity)
    // console.log('Number(this.couponForm.value.quantity)' , Number(this.couponForm.value.quantity))
    this.couponService.getCouponsCreatedFromTitleDescriptionPrice(this.couponPass).subscribe(coupons => {
      this.getCouponsCreatedFromTitleDescriptionPrice = JSON.parse(JSON.stringify(coupons));
      console.log('unlimited in save change', this.marked);

      if (Number(this.couponPass.quantity) <= Number(this.couponForm.value.quantity)) {
      // console.log('quantità uguali')

        console.log('this.couponForm.value.purchasable', this.couponForm.value.purchasable)
        for (const i of this.getCouponsCreatedFromTitleDescriptionPrice) {
          // console.log('dentro for', i)
          this.coupon = {
            'id': i.id,
            'title': this.couponForm.value.title,
            'description': this.couponForm.value.description === '' ? null : this.couponForm.value.description,
            'timestamp': this.couponForm.value.timestamp,
            'image': this.imagePath ? this.imagePath : this.couponPass.image,
            'price': this.price != null ? this.price : this.couponForm.value.price,
            'valid_from': this.dateFrom.getTime().valueOf(),
            'valid_until': this.marked ? null : this.returnDateUntil(this.dateUntil),
            'state':         this.marked4 ? 3 : 0,
            'constraints': this.couponForm.value.constraints === '' ? null : this.couponForm.value.constraints,
            'owner': this.couponForm.value.owner,
            'consumer': this.couponForm.value.consumer,
            'purchasable': this.couponForm.value.purchasable,
          };

          this.couponService.editCoupon(this.coupon).subscribe(
            (data) => {

              // console.log('dentro edit coupon con quantità maggiore')

              this.router.navigate(['/reserved-area/producer/list']);
            }, error => {
              // console.log('errore edit coupon con quantità maggiore')

              console.log(error);
            }
          );
        }
      const k = this.couponPass.quantity;
      this.coupon = {
        'title': this.couponForm.value.title,
        'description': this.couponForm.value.description === '' ? null : this.couponForm.value.description,
        'timestamp': this.couponForm.value.timestamp,
        'image': this.imagePath ? this.imagePath : this.couponPass.image,
        'price': this.price != null ? this.price : this.couponForm.value.price,
        'valid_from': this.dateFrom.getTime().valueOf(),
        'valid_until': this.marked ? null : this.returnDateUntil(this.dateUntil),
        'state':         this.marked4 ? 3 : 0,
        'constraints': this.couponForm.value.constraints === '' ? null : this.couponForm.value.constraints,
        'owner': this.couponForm.value.owner,
        'consumer': this.couponForm.value.consumer,
        'purchasable': this.couponForm.value.purchasable,

      };
      for (let mario = k ; mario < this.couponForm.value.quantity ; mario++) {
        // console.log('j', mario)
        // console.log('Number(this.couponForm.value.quantity)' , Number(this.couponForm.value.quantity))
        this.couponService.register(this.coupon).subscribe(() => {
          // console.log('dentro register coupon con quantità diverse')

          this.router.navigate(['/reserved-area/producer/list']);
        });
      }

    } else {
      // console.log('dentro register coupon con quantità diverse')

      for (let i = 0; i < this.couponPass.quantity; i++) {
           // console.log('dentro else')
            if ( i < this.couponForm.value.quantity) {
              this.coupon = {
                'id': this.getCouponsCreatedFromTitleDescriptionPrice[i].id,
                'title': this.couponForm.value.title,
                'description': this.couponForm.value.description === '' ? null : this.couponForm.value.description,
                'timestamp': this.couponForm.value.timestamp,
                'image': this.imagePath ? this.imagePath : this.couponPass.image,
                'price': this.price != null ? this.price : this.couponForm.value.price,
                'valid_from': this.dateFrom.getTime().valueOf(),
                'valid_until': this.marked ? null : this.returnDateUntil(this.dateUntil),
                'state':         this.marked4 ? 3 : 0,
                'constraints': this.couponForm.value.constraints === '' ? null : this.couponForm.value.constraints,
                'owner': this.couponForm.value.owner,
                'consumer': this.couponForm.value.consumer,
                'purchasable': this.couponForm.value.purchasable,

              };
              this.couponService.editCoupon(this.coupon).subscribe(
                (data) => {

                  // console.log('dentro edit coupon con quantità maggiore')

                  this.router.navigate(['/reserved-area/producer/list']);
                }, error => {
                  // console.log('errore edit coupon con quantità maggiore')

                  console.log(error);
                }
              );
            } else {
              this.couponService.deleteCoupon(this.getCouponsCreatedFromTitleDescriptionPrice[i].id).subscribe(() => {
                this.router.navigate(['/reserved-area/producer/list']);
              });
            }
          }
        }
    this.toastEdited();
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

  toggleVisibility(e) {
    this.marked = e.target.checked;
    delete this.couponForm.value.valid_until ;
    this.couponForm.value.valid_until_empty = true;
    console.log('unlimited', this.marked);
    if (this.marked === true) {
      this.couponForm.get('valid_until').disable();
    } else {
      this.couponForm.get('valid_until').enable();

    }
  }

  toggleVisibility2(e) {
    this.marked2 = e.target.checked;
    this.price = 0;

  }
  toggleVisibility3(e) {
    this.marked3 = e.target.checked;
    this.couponForm.value.constraints = '';
  }

  toggleVisibility4(e) {
    this.marked4 = e.target.checked;
    this.couponForm.value.state = 3;
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
  toastEdited() {
    this.toastr.success('Edited coupon', 'Coupon edited successfully');
  }

  couponCreateCopy() {

    this.couponCreate();
    // this.saveChange();
  }

  couponCreate() {
    if (this.fromEdit === false) {

      this.dateFrom = new Date(this.couponForm.value.valid_from);
      this.dateUntil = new Date(this.couponForm.value.valid_until);

      if (!isValidDate(this.dateUntil)) {
        this.dateUntil = null;
      }
      this.submitted = true;
      if (this.couponForm.invalid) {
        console.log('coupon invalid');
        return;

      }
      if (this.marked) {
        if (this.marked) {
          this.couponForm.removeControl('valid_until');
          this.couponForm.removeControl('valid_until');


        }
      }
      for ( let i = 0; i <   this.couponForm.value.quantity; i++) {
      this.couponCopy = new Coupon(
        null,
        this.couponForm.value.title,
        this.couponForm.value.description,
        this.imagePath ? this.imagePath : this.couponPass.image,
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
      this.couponService.register(this.couponCopy).pipe(first())
        .subscribe(
          data => {
            // console.log('new coupon create', data);
            this.idCopy = JSON.parse( JSON.stringify(data)).id;
            // console.log('id', JSON.parse( JSON.stringify(data)).id);

            this.router.navigate(['/reserved-area/producer/list']);

          }, error => {
            console.log(error);
          }
        );
      }
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
