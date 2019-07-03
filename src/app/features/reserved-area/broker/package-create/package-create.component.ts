import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Coupon, Package, PackItem} from '../../../../shared/_models/Coupon';
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
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ITEM_TYPE} from '../../../../shared/_models/CartItem';

@Component({
  selector: 'app-feature-reserved-area-package-create',
  templateUrl: './package-create.component.html',
  styleUrls: ['./package-create.component.scss'],
})

export class FeatureReservedAreaPackageCreateComponent implements OnInit, OnDestroy {

  @ViewChild('couponAdding') couponAdding;

  coupons: Coupon[] = [];
  couponsAvailable: Coupon[] = [];

  packageForm: FormGroup;
  myForm: FormGroup;
  maxQuantity: number;
  isMax: boolean;
  editCoupon: boolean;

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

  selectedCoupons: Array<PackItem> = [];
  selectedCategories = [];
  modalCoupon: Coupon;

  modalRef: BsModalRef;

  check = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private couponService: CouponService,
    private categoriesService: CategoriesService,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private packageService: PackageService,
  ) {
    this.categoriesService.getAll().subscribe(cat => {
      this.categories = cat;
    });


  }

  async ngOnInit() {

    this.packageForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(40), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(255), Validators.required])],
      image: [this.imagePath, Validators.required],
      price: [0, Validators.required],
      published_from: [new Date()],
      coupons: [this.selectedCoupons,],
      selected: [this.selectedCoupons],
      categories: [this.selectedCategories],
      valid_from: [new Date(), Validators.required],
      valid_until: [null],
      valid_until_empty: [this.markedUnlimited],
      quantity: [1, Validators.required],
      constraints: [null],
      purchasable: [1, Validators.required]
    }, {
      validator: Validators.compose([DateValidation.CheckDateDay, QuantityPackageValidation.CheckQuantityPackage])
    });

    await this.setCoupons();



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

    console.log('chiamato SAVE');

    this.submitted = true;
    // It stops here if form is invalid
    if (this.packageForm.invalid || this.imagePath == null) {
      console.error('Errore nel form o nell\'immagine');
      return;
    }


    const pack: Package = {
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
      package: this.selectedCoupons,
      categories: this.selectedCategories,
      type: ITEM_TYPE.PACKAGE
    };


    console.warn('PACK', pack);

    this.addPackage(pack);
  }

  addPackage(pack: Coupon) {
    console.log('RICEVUTO: ', pack);
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

  // async checking() {
  //   this.check = await QuantityPackageValidation.CheckQuantityPackage;
  //   return this.check;
  // }

  async setCoupons() {
    try {
      this.coupons = await this.couponService.getBrokerCoupons().toPromise();

      if (!this.coupons || this.coupons.length === 0) {
        this.toastr.warning('Attualmente non puoi creare dei pacchetti: non hai coupon disponibili.', 'Non ci sono coupon disponibili.');
      }

      this.couponsAvailable = this.coupons;

    } catch (e) {
      console.error(e);
      this.toastr.error('C\'è stato un errore recuperando i coupon disponibili. Per favore, riprova più tardi.', 'Errore recuperando i coupon dispobili.');
    }
  }

  addToPackage(coupon: Coupon) {
    console.warn(coupon);
    if (this.editCoupon) {
      for (let el of this.selectedCoupons) {
        if (el.coupon.id === coupon.id) {
          el.quantity = this.myForm.value.quantity;
        }
      }
    } else {
      this.selectedCoupons.push({
        coupon: coupon,
        quantity: this.myForm.value.quantity
      });

      this.couponsAvailable = this.couponsAvailable.filter(cp => cp.id !== coupon.id);

      if (this.couponsAvailable.length === 0) {
        this.packageForm.get('coupons').disable();
      }
    }


    this.closeModal();
  }

  changeCouponQuantity(type: boolean) {
    if (type) {
      this.myForm.controls.quantity.setValue((this.myForm.value.quantity + 1));
      this.isMax = this.myForm.value.quantity === this.maxQuantity;
    } else {
      this.myForm.controls.quantity.setValue((this.myForm.value.quantity - 1));
      this.isMax = false;
    }
  }


  deleteSelected(coupon_id: number) {
    this.selectedCoupons = this.selectedCoupons.filter(el => el.coupon.id !== coupon_id);
    this.couponsAvailable.push(this.coupons.find(coupon => coupon.id === coupon_id));

    console.warn('FOUND', this.coupons.find(coupon => coupon.id === coupon_id));

    if (!this.packageForm.get('coupons').enabled) {
      this.packageForm.get('coupons').enable();
      // document.getElementById('couponChoice')['value'] = 0;
    }

    // document.getElementById('couponChoice')['value'] = 0;
  }

  openModal(template: TemplateRef<any>, coupon_id = null, edit = false) {
    // this.modalCoupon = this.packageForm.get('coupons').value;

    if (coupon_id != 0) {

      coupon_id = coupon_id || this.packageForm.get('coupons').value;
      // this.modalCoupon = edit ? this.coupons.find(coupon => coupon.id == coupon_id) : this.packageForm.get('coupons').value;
      this.modalCoupon = this.coupons.find(coupon => coupon.id == coupon_id);

      // this.modalCoupon = this.coupons.find(coupon => coupon.id == coupon_id);
      this.maxQuantity = this.modalCoupon.purchasable === null ? this.modalCoupon.quantity : this.modalCoupon.quantity - this.modalCoupon.purchasable;

      // this.maxQuantity = await this.cartActions.getQuantityAvailableForUser(coupon.id);

      this.myForm = this.formBuilder.group({
        quantity: [1, Validators.compose([Validators.min(1), Validators.max(this.maxQuantity), Validators.required])]
      });

      this.isMax = this.myForm.value.quantity === this.maxQuantity;

      if (this.maxQuantity > 0) {
        this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
      } else {
        this.toastr.error('Hai già raggiunto la quantità massima acquistabile per questo coupon o è esaurito.', 'Coupon non disponibile');
      }
      this.editCoupon = edit;
    }
  }

  closeModal() {
    // document.getElementById('couponChoice')['value'] = 0;
    this.modalRef.hide();
  }
}


