import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Coupon} from '../../../../shared/_models/Coupon';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {Router} from '@angular/router';
import {DateValidation} from './validator/DateValidation.directive';
import {StoreService} from '../../../../shared/_services/store.service';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {QuantityPackageValidation} from './validator/QuantityPackageValidation.directive';
import {environment} from '../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {CategoriesService} from '../../../../shared/_services/categories.service';
import {PackageService} from '../../../../shared/_services/package.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-feature-reserved-area-package-create',
  templateUrl: './package-create.component.html',
  styleUrls: ['./package-create.component.scss'],
})

export class FeatureReservedAreaPackageCreateComponent implements OnInit, OnDestroy {

  couponsAvailable: Coupon[];

  packageForm: FormGroup;

  categories: any;
  markedUnlimited = false;
  markedFree = false;
  markedConstraints = false;
  markedQuantity = false;
  markedPrivate = false;
  submitted = false;

  bgColorCalendar = '#FFF';
  bgColorPrivate = '#FFF';

  imagePath: string = null;

  public uploader: FileUploader = new FileUploader({
    url: environment.protocol + '://' + environment.host + ':' + environment.port + '/coupons/addImage', // fix for broker
    authToken: 'Bearer ' + this.storeService.getToken()
  });

  selectedCoupons = [];
  selectedCategories = [];

  check = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private couponService: CouponService,
    private categoriesService: CategoriesService,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService,
    private packageService: PackageService,
  ) {
      this.categoriesService.getAll().subscribe( cat => {
        this.categories = cat;
      });


  }

    ngOnInit() {

      this.setCoupons();

    this.packageForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(40), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(255), Validators.required])],
      image: [this.imagePath, Validators.required ],
      price: [0, Validators.required],
      published_from: [new Date()],
      coupons: [this.selectedCoupons],
      categories: [this.selectedCategories],
      valid_from: [new Date(), Validators.required],
      valid_until: [null],
      valid_until_empty: [this.markedUnlimited],
      quantity: [1, [Validators.required]],
      constraints: [null],
      purchasable: [1, Validators.required]
    }, {
      validator: Validators.compose([DateValidation.CheckDateDay, QuantityPackageValidation.CheckQuantityPackage])
    });

    this.checking();

    console.log('check', this.check);
    this.addBreadcrumb();

    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  get f() {
    return this.packageForm.controls;
  }

  saveCoupon() {
    this.submitted = true;
    // It stops here if form is invalid
    if (this.packageForm.invalid || this.imagePath == null) {
      return;
    }

    const pack: Coupon = {
      title: this.f.title.value,
      description: this.f.description.value,
      image: this.imagePath,
      price: this.markedFree ? 0 : this.f.price.value,
      visible_from: this.markedPrivate ? null : (new Date(this.f.published_from.value)).getTime().valueOf(),
      valid_from: (new Date(this.f.valid_from.value)).getTime().valueOf(),
      valid_until: this.markedUnlimited ? null : (new Date(this.f.valid_until.value)).getTime().valueOf(),
      constraints: this.markedConstraints ? null : this.f.constraints.value,
      purchasable: this.markedQuantity ? null : this.f.purchasable.value,
      quantity: this.f.quantity.value,
      coupons: this.selectedCoupons,
      categories: this.selectedCategories,
      type: 1
    };

    this.addPackage(pack);
  }

  addPackage(pack: Coupon) {
    this.couponService.create(pack)
      .subscribe(data => {
        if (data['created']) {
          this.toastr.success('', 'Pacchetto creato con successo!');
          this.router.navigate(['/reserved-area/broker/list']);
        } else {
          this.toastr.error('Errore imprevisto durante la creazione del pacchetto.', 'Errore durante la creazione');
        }
      }, err => {
        console.log(err);
        this.toastr.error('Errore imprevisto durante la creazione del pacchetto .', 'Errore durante la creazione');
      });
  }

  toggleCheckbox(e) {
    switch (e.srcElement.id) {
      case 'privateCheck':
        this.markedPrivate = e.target.checked;

        if (this.markedPrivate) {
          this.packageForm.get('published_from').disable();
          // this.couponForm.get('published_from').setValue(null);
          this.bgColorPrivate = '#E4E7EA';
        } else {
          this.packageForm.get('published_from').enable();
          // this.couponForm.get('published_from').setValue(Date.now());
          this.bgColorPrivate = '#FFF';
        }
        break;
      case 'freeCheck':
        this.markedFree = e.target.checked;

        if (this.markedFree) {
          this.packageForm.get('price').disable();
        } else {
          this.packageForm.get('price').enable();
        }
        break;
      case 'unlimitedCheck':
        this.markedUnlimited = e.target.checked;

        if (this.markedUnlimited === true) {
          this.packageForm.get('valid_until').disable();
          this.bgColorCalendar = '#E4E7EA';
        } else {
          this.packageForm.get('valid_until').enable();
          this.bgColorCalendar = '#FFF';
        }

        delete this.packageForm.value.valid_until;
        this.packageForm.value.valid_until_empty = true;
        break;
      case 'constraintsCheck':
        this.markedConstraints = e.target.checked;

        if (this.markedConstraints) {
          this.packageForm.get('constraints').disable();
        } else {
          this.packageForm.get('constraints').enable();
        }

        this.packageForm.value.constraints = '';
        break;
      case 'quantityCheck':
        this.markedQuantity = e.target.checked;

        if (this.markedQuantity) {
          this.packageForm.get('purchasable').disable();
        } else {
          this.packageForm.get('purchasable').enable();
        }
        break;
    }
  }

  setAddress(addressObtained) {
    this.packageForm.get('constraints').setValue(addressObtained);
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const data = JSON.parse(response); // success server response
    this.imagePath = data.image;
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    // let error = JSON.parse(response); //error server response
    // console.log(response);
    // console.log(this.uploader.queue[0]);
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Aggiungi Pacchetto', '/reserved-area/broker/create/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  async checking() {
    this.check = await QuantityPackageValidation.CheckQuantityPackage;
    return this.check;
  }

  setCoupons() {

    this.couponService.getBrokerCoupons().subscribe(coupons => {
      console.log('dentro setCoupons', this.couponsAvailable)
      if (coupons) {
        for   (const coupon of coupons) {
          const quantity = coupon.quantity;
          const id = coupon.id;
          this.packageService.getAssignCouponsById(id).subscribe(assignCoupon => {
            const purchesable = coupon.purchasable;
            const assign =  assignCoupon.assign;
            console.log('purch', purchesable);
            console.log('assign', assign);
            console.log('quantity', quantity);
            this.couponsAvailable = [];
            if (!purchesable) {
              console.log('null');
              for  (let i = 0; i < quantity; i++) {
                this.couponsAvailable.push(coupon);
                console.log('this.couponsAvailable null', this.couponsAvailable);
              }
            } else if ( assign == purchesable) {
              this.toastr.error( 'Non hai coupons disponibili!');
              return;

            } else if (assign < purchesable && purchesable <= quantity) {

              for (let i = 0; i < (purchesable - assign); i++) {
                this.couponsAvailable.push(coupon);
              }
            } else if (assign < purchesable && purchesable > quantity && (purchesable - assign) >= quantity) {

              for (let i = 0; i < quantity ; i++) {
                this.couponsAvailable.push(coupon);
              }
            } else if (assign < purchesable && purchesable > quantity && (purchesable - assign) < quantity) {

              for (let i = 0; i < purchesable - assign ; i++) {
                this.couponsAvailable.push(coupon);
              }
            }
            console.log('this.couponsAvailable.length', this.couponsAvailable.length)
            if (this.couponsAvailable.length == 0) {
              this.toastr.error( 'Non hai coupons disponibili!');
            }
            return this.couponsAvailable;
          });
        }
        console.log('this.couponsAvailable dopo for', this.couponsAvailable);

      }
    });

  }
}


