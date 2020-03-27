import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { ITEM_TYPE } from '../../../../shared/_models/CartItem';
import { Coupon, Package, PackItem } from '../../../../shared/_models/Coupon';
import { CategoriesService } from '../../../../shared/_services/categories.service';
import { CouponService } from '../../../../shared/_services/coupon.service';
import { PackageService } from '../../../../shared/_services/package.service';
import { StoreService } from '../../../../shared/_services/store.service';
import { DateValidation } from './validator/DateValidation.directive';
import { QuantityPackageValidation } from './validator/QuantityPackageValidation.directive';

@Component({
  selector: 'app-feature-reserved-area-package-create',
  templateUrl: './package-create.component.html',
  styleUrls: ['./package-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FeatureReservedAreaPackageCreateComponent implements OnInit, OnDestroy {

  coupons: Array<Coupon> = [];
  couponsAvailable: Array<Coupon> = [];
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
  imageSelected = null;

  uploader: FileUploader = new FileUploader({
    url: environment.protocol + '://' + environment.host + ':' + environment.port + '/coupons/addImage', // fix for broker
    authToken: 'Bearer ' + this.storeService.getToken()
  });

  selectedCoupons: Array<PackItem> = [];
  selectedCategories = [];
  modalCoupon: Coupon;
  modalRef: BsModalRef;
  check = true;

  couponPass: any;
  imageURL = environment.protocol + '://' + environment.host + ':' + environment.port + '/';

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
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe(event => {
      if (event) {
        if (event['url'] !== undefined) {
          const index = event['url'].indexOf('=');
          if (index !== -1) {
            this.check = Boolean(event['url'].substr(index + 1));
            this.control();
          }
        }
      }
    });

  }

  async ngOnInit(): Promise<void> {
    await this.control();

  }

  async control(): Promise<void> {
    this.categoriesService.getAll().subscribe(cat => {
      this.categories = cat;
      this.couponService.currentMessage.subscribe(coupon => {
        this.couponPass = coupon;
        if (this.check || !this.couponPass) {
          this.packageForm = this.formBuilder.group({
            title: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(80), Validators.required])],
            description: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(500), Validators.required])],
            image: [this.imagePath, Validators.required],
            price: [0, Validators.required],
            published_from: [new Date()],
            coupons: [this.selectedCoupons],
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

        } else if (this.couponPass && !this.check) {
          this.packageForm = this.formBuilder.group({
            title: [this.couponPass.title, Validators.compose([Validators.minLength(5), Validators.maxLength(80), Validators.required])],
            description: [this.couponPass.description, Validators.compose([Validators.minLength(5), Validators.maxLength(500), Validators.required])],
            image: [this.imagePath, Validators.required],
            price: [this.couponPass.price, Validators.required],
            published_from: [new Date()],
            coupons: [this.selectedCoupons],
            selected: [this.selectedCoupons],
            categories: [this.selectedCategories],
            valid_from: [new Date(), Validators.required],
            valid_until: [null],
            valid_until_empty: [this.markedUnlimited],
            quantity: [1, Validators.required],
            constraints: [this.couponPass.constraints],
            purchasable: [this.couponPass.purchasable, Validators.required]
          }, {
            validator: Validators.compose([DateValidation.CheckDateDay, QuantityPackageValidation.CheckQuantityPackage])
          });
        }
      });
    });
    await this.setCoupons();

    this.addBreadcrumb();

    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
    this.couponService.setCoupon(null);
  }

  get f() {
    return this.packageForm.controls;
  }

  saveCoupon() {

    this.submitted = true;
    // It stops here if form is invalid
    if (this.packageForm.invalid || this.imagePath == undefined) {
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
      categories: this.f.categories.value,
      type: ITEM_TYPE.PACKAGE
    };

    this.addPackage(pack);
  }

  async addPackage(pack: Coupon) {

    const uploadDone = await this.uploadFiles(this.uploader);
    if (!uploadDone) {
      this.toastr.error('Errore imprevisto durante il caricamento dell\'immagine.', 'Errore caricamento immagine');

      return;
    }
    this.couponService.create(pack)
      .subscribe(data => {
        if (data.created) {
          this.toastr.success('', 'Pacchetto creato con successo!');
          this.router.navigate(['/reserved-area/broker/list']);
        } else {
          this.toastr.error('Errore imprevisto durante la creazione del pacchetto.', 'Errore durante la creazione');
        }
      }, err => {
        //console.log(err);
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

  }

  addBreadcrumb() {
    const bread = [] as Array<Breadcrumb>;

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Crea Pacchetto', '/reserved-area/broker/create/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

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
    if (this.editCoupon) {
      for (const el of this.selectedCoupons) {
        if (el.coupon.id === coupon.id) {
          el.quantity = this.myForm.value.quantity;
        }
      }
    } else {
      this.selectedCoupons.push({
        coupon,
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
      this.maxQuantity = this.modalCoupon.quantity ;

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

  preview(files) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == undefined) {
      return;
    }

    const reader = new FileReader();
    this.imagePath = files[0].name;
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      this.imageSelected = reader.result;
    };
  }
  async uploadFiles(inputElement) {

    if (inputElement.queue[0]) {

      try {
        inputElement.queue[0].upload();
        this.imagePath = inputElement.queue[0]._file.name;

        return true;
      } catch (e) {
        //console.log('error upload image', e);
        this.imagePath = null;

        return false;
      }
    } else {
      return true;
    }
  }
}
