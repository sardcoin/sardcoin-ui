import {Component, OnDestroy, OnInit} from '@angular/core';
import {Coupon} from '../../../../shared/_models/Coupon';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {Router} from '@angular/router';
import {DateValidation} from './validator/DateValidation.directive';
import {StoreService} from '../../../../shared/_services/store.service';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {QuantityCouponValidation} from './validator/QuantityCouponValidation.directive';
import {environment} from '../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {User} from '../../../../shared/_models/User';
import {UserService} from '../../../../shared/_services/user.service';
import {CategoriesService} from '../../../../shared/_services/categories.service';
import {Category} from '../../../../shared/_models/Category';

@Component({
  selector: 'app-feature-reserved-area-coupon-create',
  templateUrl: './coupon-create.component.html',
  styleUrls: ['./coupon-create.component.scss'],
})

export class FeatureReservedAreaCouponCreateComponent implements OnInit, OnDestroy {
  couponForm: FormGroup;

  brokers: User[];

  markedUnlimited = false;
  markedFree = false;
  markedConstraints = false;
  markedQuantity = false;
  markedPrivate = false;
  submitted = false;
  categories: any;
  selectedCategories: Category[] = [];

  bgColorCalendar = '#FFF';
  bgColorPrivate = '#FFF';

  imagePath: string = null;

  public uploader: FileUploader = new FileUploader({
    url: environment.protocol + '://' + environment.host + ':' + environment.port + '/coupons/addImage',
    authToken: 'Bearer ' + this.storeService.getToken()
  });

  selectedBroker = [];


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private couponService: CouponService,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService,
    private userService: UserService,
    private categoriesService: CategoriesService,

  ) {
    this.userService.getBrokers().subscribe( brokers => {
      this.brokers = brokers;
    });

    this.categoriesService.getAll().subscribe(cat => {
      this.categories = cat;
    });

  }

  ngOnInit(): void {
    this.couponForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(40), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(255), Validators.required])],
      image: [this.imagePath, Validators.required ],
      price: [0, Validators.required],
      published_from: [new Date()],
      categories: [this.selectedCategories],
      broker: [this.selectedBroker],
      valid_from: [new Date(), Validators.required],
      valid_until: [null],
      valid_until_empty: [this.markedUnlimited],
      quantity: [1, Validators.required],
      constraints: [null],
      purchasable: [1, Validators.required]
    }, {
      validator: Validators.compose([DateValidation.CheckDateDay, QuantityCouponValidation.CheckQuantityCoupon])
    });

    this.addBreadcrumb();

    }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  get f() {
    return this.couponForm.controls;
  }

    async saveCoupon() {
    this.submitted = true;
    console.log('this.uploader', this.uploader);
      await this.uploadFiles(this.uploader);

      // It stops here if form is invalid or not upload image
    if (this.couponForm.invalid || this.imagePath == null) {
      return;
    }

    const coupon: Coupon = {
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
      brokers: this.selectedBroker,
      categories: this.selectedCategories

    };

    console.log('broker selezionati', this.selectedBroker);
    this.addCoupon(coupon);
  }

  addCoupon(coupon: Coupon) {
    this.couponService.create(coupon)
      .subscribe( data => {

        if (data['created']) {
          this.toastr.success('', 'Coupon creato con successo!');
          this.router.navigate(['/reserved-area/producer/list']);
        } else {
          this.toastr.error('Errore imprevisto durante la creazione del coupon.', 'Errore durante la creazione');
        }
      }, err => {
        console.log(err);
        this.toastr.error('Errore imprevisto durante la creazione del coupon.', 'Errore durante la creazione');
      });
  }

  toggleCheckbox(e) {
    switch (e.srcElement.id) {
      case 'privateCheck':
        this.markedPrivate = e.target.checked;

        if (this.markedPrivate) {
          this.couponForm.get('published_from').disable();
          // this.couponForm.get('published_from').setValue(null);
          this.bgColorPrivate = '#E4E7EA';
        } else {
          this.couponForm.get('published_from').enable();
          // this.couponForm.get('published_from').setValue(Date.now());
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

  setAddress(addressObtained) {
    this.couponForm.get('constraints').setValue(addressObtained);
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Aggiungi coupon', '/reserved-area/producer/create/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

   async uploadFiles(inputElement) {
    if (inputElement) {

      try {
        inputElement.queue[0].upload();
        this.imagePath = inputElement.queue[0]._file.name;
      } catch (e) {
        console.log('error upload image', e);
        this.imagePath = null;
      }

    }


  }


}


