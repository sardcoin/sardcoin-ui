import {Component, OnDestroy, OnInit} from '@angular/core';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {StoreService} from '../../../../shared/_services/store.service';
import {QuantityPackageValidation} from '../package-create/validator/QuantityPackageValidation.directive';
import {environment} from '../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {Coupon} from '../../../../shared/_models/Coupon';
import {DateValidation} from '../package-create/validator/DateValidation.directive';
import {CategoriesService} from '../../../../shared/_services/categories.service';

@Component({
  selector: 'app-edit-package',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.scss'],
})

export class PackageEditComponent implements OnInit, OnDestroy {

  couponForm: FormGroup;
  couponsAvailable: Coupon[];
  selectedCoupons = [];
  selectedCategories = [];
  categories: any;
  markedUnlimited = false;
  markedFree = false;
  markedConstraints = false;
  markedQuantity = false;
  markedPrivate = false;

  bgColorCalendar = '#FFF';
  bgColorPrivate = '#FFF';

  fromEdit = false;
  submitted = false;

  couponPass: any;

  imageURL = environment.protocol + '://' + environment.host + ':' + environment.port + '/';
  imagePath: string = null;

  public uploader: FileUploader = new FileUploader({
    url: environment.protocol + '://' + environment.host + ':' + environment.port + '/coupons/addImage',
    authToken: 'Bearer ' + this.storeService.getToken(),
  });

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public couponService: CouponService,
    private categoriesService: CategoriesService,
    public storeService: StoreService,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService
  ) {
    this.categoriesService.getAll().subscribe(cat => {
      this.categories = cat;
    });
    this.couponService.currentMessage.subscribe(coupon => {
      this.couponPass = coupon;
      console.log('categories', this.couponPass.categories);
      console.log('coupons', this.couponPass.coupons);

      for (const cp of this.couponPass.coupons) {
        this.selectedCoupons.push(cp.coupon);
      }
      console.log('pacchetto', this.couponPass);

      if (this.couponPass === null || this.couponPass === undefined) {
        this.router.navigate(['/reserved-area/broker/list']);
      }
    });
    this.couponService.checkFrom.subscribe(fromEdit => this.fromEdit = fromEdit);

    this.couponService.getBrokerCoupons().subscribe(cp => {

      this.couponsAvailable = [];
      const coupons = cp;
      for (const coupon of coupons) {
        const quantity = coupon.quantity;
        const purchesable = coupon.purchasable;
        if (purchesable == null) {
          for (let i = 0; i < quantity; i++) {
            this.couponsAvailable.push(coupon);
          }
        } else if (purchesable <= quantity) {
          for (let i = 0; i < purchesable; i++) {
            this.couponsAvailable.push(coupon);
          }

        } else {
          for (let i = 0; i < quantity; i++) {
            this.couponsAvailable.push(coupon);
          }

        }
      }
      // this.couponsAvailable = cp;
      console.log('cpBroker', this.couponsAvailable);
    });
  }

  ngOnInit() {
    // If the coupon passed does not exist, the user is been redirect to the list of coupons
    if (this.couponPass === null || this.couponPass === undefined) {
      this.router.navigate(['/reserved-area/broker/list']);
    }

    this.imageURL = this.imageURL + this.couponPass.package.image;
    const until = this.couponPass.valid_until === null ? '' : this.couponPass.valid_until;

    this.initMarked();

    this.bgColorCalendar = this.markedUnlimited ? '#E4E7EA' : '#FFF';
    this.bgColorPrivate = this.markedPrivate ? '#E4E7EA' : '#FFF';

    this.couponForm = this.formBuilder.group({
      title: [this.couponPass.package.title, Validators.compose([Validators.maxLength(40), Validators.minLength(5), Validators.required])],
      description: [this.couponPass.package.description, Validators.compose([Validators.maxLength(200), Validators.minLength(5), Validators.required])],
      image: [this.imagePath],
      price: [{value: this.markedFree ? 0 : this.couponPass.package.price.toFixed(2), disabled: this.markedFree}, Validators.compose([Validators.required])],
      valid_until_empty: [this.markedUnlimited],
      published_from: [{value: this.markedPrivate ? null : this.couponPass.package.visible_from, disabled: this.markedPrivate}],
      coupons: [{value: this.selectedCoupons, disabled: true}],
      categories: [this.selectedCategories],
      valid_from: [this.couponPass.package.valid_from, Validators.compose([Validators.required])],
      valid_until: [{value: this.markedUnlimited ? null : until, disabled: this.markedUnlimited}],
      constraints: [{value: this.markedConstraints ? null : this.couponPass.package.constraints, disabled: this.markedConstraints}],
      quantity: [{value: this.couponPass.package.quantity, disabled: this.fromEdit}],
      purchasable: [{value: this.markedQuantity ? null : this.couponPass.package.purchasable, disabled: this.markedQuantity}, Validators.required]
    }, {
      validator: Validators.compose([DateValidation.CheckDateDay, QuantityPackageValidation.CheckQuantityPackage])
    });

    this.addBreadcrumb();
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }

  get f() {
    return this.couponForm.controls;
  }

  saveChange() {
    this.submitted = true;

    if (this.couponForm.invalid) {
      return;
    }

    const coupon: Coupon = {
      id: this.couponPass.package.id,
      title: this.f.title.value,
      description: this.f.description.value,
      image: this.imagePath ? this.imagePath : this.couponPass.image,
      timestamp: this.couponPass.timestamp,
      price: this.markedFree ? 0 : this.f.price.value,
      visible_from: this.markedPrivate ? null : (new Date(this.f.published_from.value)).getTime().valueOf(),
      valid_from: (new Date(this.f.valid_from.value)).getTime().valueOf(),
      valid_until: this.markedUnlimited ? null : (new Date(this.f.valid_until.value)).getTime().valueOf(),
      constraints: this.markedConstraints ? null : this.f.constraints.value,
      purchasable: this.markedQuantity ? null : this.f.purchasable.value,
      quantity: this.f.quantity.value
    };

    // If true, the coupon is in edit mode, else the producer is creating a clone of a coupon
    if (this.fromEdit) {
      this.editCoupon(coupon);
    } else {
      delete coupon.id;
      this.createCopy(coupon);
    }
  }

  createCopy(coupon: Coupon) {

    this.couponService.create(coupon)
      .subscribe(data => {

        // if (data['created']) {
          this.toastr.success('', 'Coupon creato con successo!');
          this.router.navigate(['/reserved-area/producer/list']);
        // } else {
        //   this.toastr.error('Errore imprevisto durante la creazione del coupon.', 'Errore durante la creazione');
        // }
      }, err => {
        console.log(err);
        this.toastr.error('Errore imprevisto durante la creazione del coupon.', 'Errore durante la creazione');
      });
  }

  editCoupon(coupon: Coupon) {
    this.couponService.editCoupon(coupon)
      .subscribe(data => {
        // if (data['status']) {
        //   this.toastr.error('Errore imprevisto durante l\'aggiornamento del coupon.', 'Errore durante l\'aggiornamento');
        // } else {
          this.toastr.success('', 'Coupon modificato con successo!');
          this.router.navigate(['/reserved-area/producer/list']);
        // }
      }, err => {
        console.log(err);
        this.toastr.error('Errore imprevisto durante l\'aggiornamento del coupon.', 'Errore durante l\'aggiornamento');
      });
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/reserved-area/producer/'));
    bread.push(new Breadcrumb('Modifica ' + this.couponPass.title, '/reserved-area/producer/edit/'));

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

  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    console.log(response);
  }

  toggleCheckbox(e) {

    switch (e.srcElement.id) {

      case 'privateCheck':
        this.markedPrivate = e.target.checked;

        if (this.markedPrivate) {
          this.couponForm.get('published_from').disable();
          this.couponForm.get('published_from').setValue(null);
          this.bgColorPrivate = '#E4E7EA';
        } else {
          this.couponForm.get('published_from').enable();
          this.couponForm.get('published_from').setValue(Date.now());
          this.bgColorPrivate = '#FFF';
        }
        break;

      case 'freeCheck':
        this.markedFree = e.target.checked;

        if (this.markedFree) {
          this.couponForm.get('price').disable();
        } else {
          this.couponForm.get('price').enable();
        }
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

        if (this.markedConstraints) {
          this.couponForm.get('constraints').disable();
        } else {
          this.couponForm.get('constraints').enable();
        }

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

  initMarked() {
    this.markedUnlimited = this.couponPass.valid_until === null;
    this.markedQuantity = this.couponPass.purchasable === null;
    this.markedFree = this.couponPass.price === 0;
    this.markedConstraints = this.couponPass.constraints === null;
    this.markedPrivate = this.couponPass.visible_from === null;
  }


  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (e: any) => { // called once readAsDataURL is completed
        this.imageURL = String(e.target.result);
      };
    }
  }
}
