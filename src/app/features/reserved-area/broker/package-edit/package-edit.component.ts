import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EditorChangeContent, EditorChangeSelection, QuillEditor } from 'ngx-quill';
import { ToastrService } from 'ngx-toastr';
import * as QuillNamespace from 'quill';
import { environment } from '../../../../../environments/environment';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { ITEM_TYPE } from '../../../../shared/_models/CartItem';
import { Coupon, Package, PackItem } from '../../../../shared/_models/Coupon';
import { CategoriesService } from '../../../../shared/_services/categories.service';
import { CouponService } from '../../../../shared/_services/coupon.service';
import { PackageService } from '../../../../shared/_services/package.service';
import { StoreService } from '../../../../shared/_services/store.service';
import { DateValidation } from '../package-create/validator/DateValidation.directive';
import { QuantityPackageValidation } from '../package-create/validator/QuantityPackageValidation.directive';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-edit-package',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.scss']
})

export class PackageEditComponent implements OnInit, OnDestroy {

  toolbarOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                        // remove formatting button
      ['link', 'image', 'video']
    ],
    imageResize: true
    // handlers: {
    //   'image': []
    //}
  }

  blured = false
  focused = false
  created(event: QuillEditor) {
    // tslint:disable-next-line:no-console
    // console.log('editor-created', event)
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    // console.log('editor-change', event)
  }

  focus($event) {
    // tslint:disable-next-line:no-console
    // console.log('focus', $event)
    this.focused = true
    this.blured = false
  }

  blur($event) {
    // tslint:disable-next-line:no-console
    // console.log('blur', $event)
    this.focused = false
    this.blured = true
  }


  packageForm: FormGroup;

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
  coupons: Array<Coupon> = [];
  couponsAvailable: Array<Coupon>;
  selectedCoupons: Array<PackItem> = [];
  selectedCategories = [];
  categories: any;
  categoriesUpdate = false;

  imageURL = environment.protocol + '://' + environment.host + ':' + environment.port + '/';
  imagePath: string = null;

  uploader: FileUploader = new FileUploader({
    url: environment.protocol + '://' + environment.host + ':' + environment.port + '/coupons/addImage',
    authToken: 'Bearer ' + this.storeService.getToken()
  });

  maxQuantity: number;
  isMax: boolean;
  modalRef: BsModalRef;
  myForm: FormGroup;
  modalCoupon: Coupon;
  changeCoupon: boolean;
  imageSelected = null;

  @ViewChild('couponAdding') couponAdding;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private couponService: CouponService,
    private categoriesService: CategoriesService,
    private storeService: StoreService,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService,
    private packageService: PackageService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer


  ) {
      this.couponService.currentMessage.subscribe(coupon => {
      this.couponPass = coupon;

      if (this.couponPass === null || this.couponPass === undefined) {
        this.router.navigate(['/reserved-area/broker/list']);
        return;
      }
      this.categoriesService.getCategoryCoupon(this.couponPass.id).subscribe(catCp => {
        this.categoriesService.getAll().subscribe(cat => {
          this.categories = cat;
          for (const c of catCp.category) {
            const category = this.categories.find(el => el.id === c.category_id);
            this.selectedCategories.push(category);
          }
          this.categoriesUpdate = true;
        });
        });
    });
      this.couponService.checkFrom.subscribe(fromEdit => {
      this.fromEdit = fromEdit;
    });

      this.couponService.getBrokerCoupons().subscribe(cp => {
      this.couponsAvailable = cp;
    });

  }

  async ngOnInit() {
    // If the coupon passed does not exist, the user is been redirect to the list of coupons
    if (this.couponPass === null || this.couponPass === undefined) {
      this.router.navigate(['/reserved-area/broker/list']);
      return;
    }

    this.imageURL = this.imageURL + this.couponPass.image;
    const until = this.couponPass.valid_until === null ? '' : this.couponPass.valid_until;

    this.initMarked();

    this.bgColorCalendar = this.markedUnlimited ? '#E4E7EA' : '#FFF';
    this.bgColorPrivate = this.markedPrivate ? '#E4E7EA' : '#FFF';

    this.packageForm = this.formBuilder.group({
      title: [this.couponPass.title, Validators.compose([Validators.minLength(5), Validators.maxLength(80), Validators.required])],
      description: [this.couponPass.description, Validators.compose([Validators.minLength(5), Validators.maxLength(55000), Validators.required])],
      image: [this.imagePath],
      price: [{value: this.markedFree ? 0 : this.couponPass.price.toFixed(2), disabled: this.markedFree}, Validators.required],
      published_from: [{value: this.markedPrivate ? null : this.couponPass.visible_from, disabled: this.markedPrivate}],
      coupons: [this.selectedCoupons],
      selected: [this.selectedCoupons],
      categories: [this.selectedCategories],
      valid_from: [this.couponPass.valid_from, Validators.compose([Validators.required])],
      valid_until: [{value: this.markedUnlimited ? null : until, disabled: this.markedUnlimited}],
      valid_until_empty: [this.markedUnlimited],
      quantity: [{value: this.couponPass.quantity, disabled: this.fromEdit}],
      constraints: [{value: this.markedConstraints ? null : this.couponPass.constraints, disabled: this.markedConstraints}],
      purchasable: [{value: this.markedQuantity ? null : this.couponPass.purchasable, disabled: this.markedQuantity}, Validators.required]
    }, {
      validator: Validators.compose([DateValidation.CheckDateDay, QuantityPackageValidation.CheckQuantityPackage])
    });

    if (this.fromEdit) {
      this.packageForm.controls.coupons.disable();
      this.packageForm.controls.selected.disable();
    } else {
    }
    await this.setCoupons();

    this.addBreadcrumb();
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }

  get f() {
    return this.packageForm.controls;
  }

  saveChange() {
    this.submitted = true;
    if (this.selectedCoupons.length > 0) {
      this.packageForm.get('coupons').disable();
    }
    if (this.packageForm.invalid) {
      this.packageForm.get('coupons').enable();

      return;
    }

    const pack: Package = {
      id: this.couponPass.id,
      title: this.f.title.value,
      description: this.f.description.value,
      image: this.imagePath ? this.imagePath : this.couponPass.image,
      price: this.markedFree ? 0 : this.f.price.value,
      visible_from: this.markedPrivate ? null : (new Date(this.f.published_from.value)).getTime().valueOf(),
      valid_from: (new Date(this.f.valid_from.value)).getTime().valueOf(),
      valid_until: this.markedUnlimited ? null : (new Date(this.f.valid_until.value)).getTime().valueOf(),
      constraints: this.markedConstraints ? null : this.f.constraints.value,
      purchasable: this.markedQuantity ? null : this.f.purchasable.value,
      brokers: [],
      timestamp: undefined,
      quantity: this.f.quantity.value,
      package: this.selectedCoupons,
      categories: this.selectedCategories,
      type: ITEM_TYPE.PACKAGE
    };

    // If true, the coupon is in edit mode, else the producer is creating a clone of a coupon
    if (this.fromEdit) {
      this.editCoupon(pack);
    } else {
      delete pack.id;
      this.createCopy(pack);
    }
  }

  async createCopy(coupon: Coupon) {
    const uploadDone = await this.uploadFiles(this.uploader);
    if (!uploadDone) {
      this.toastr.error('Errore imprevisto durante il caricamento dell\'immagine.', 'Errore caricamento immagine');

      return;
    }
    this.couponService.create(coupon)
      .subscribe(data => {

        if (data.created) {
          this.toastr.success('', 'Pacchetto creato con successo!');
          this.router.navigate(['/reserved-area/broker/list']);
        } else {
          this.toastr.error('Errore imprevisto durante la creazione del pacchetto.', 'Errore durante la creazione');
        }
      }, err => {
        //console.log(err);
        this.toastr.error('Errore imprevisto durante la creazione del pacchetto.', 'Errore durante la creazione');
      });
  }

  async editCoupon(coupon: Coupon) {
    const uploadDone = await this.uploadFiles(this.uploader);
    if (!uploadDone) {
      this.toastr.error('Errore imprevisto durante il caricamento dell\'immagine.', 'Errore caricamento immagine');

      return;
    }
    ////console.log('coupon', coupon)
    this.couponService.editCoupon(coupon)
      .subscribe(data => {
        if (!data.updated) {
          this.toastr.error('Errore imprevisto durante l\'aggiornamento del pacchetto.', 'Errore durante l\'aggiornamento');
          if (data.bought) {
            this.toastr.error('Pacchetto acquistato da uno o più utenti, non puoi più modificarlo.', 'Errore durante l\'aggiornamento');

          }
        } else {
          this.toastr.success('', 'Pacchetto modificato con successo!');
          this.router.navigate(['/reserved-area/producer/list']);
        }
      }, err => {
        //console.log(err);
        this.toastr.error('Errore di modifica, se è visibile o è stato acquistato non può essere modificato.', 'Errore');
      });
  }

  addBreadcrumb() {
    const bread = [] as Array<Breadcrumb>;

    bread.push(new Breadcrumb('Home', '/reserved-area/broker/'));
    bread.push(new Breadcrumb('Modifica ' + this.couponPass.title, '/reserved-area/broker/edit/'));

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
    //console.log(response);
  }

  toggleCheckbox(e) {

    switch (e.srcElement.id) {

      case 'privateCheck':
        this.markedPrivate = e.target.checked;

        if (this.markedPrivate) {
          this.packageForm.get('published_from').disable();
          this.packageForm.get('published_from').setValue(null);
          this.bgColorPrivate = '#E4E7EA';
        } else {
          this.packageForm.get('published_from').enable();
          this.packageForm.get('published_from').setValue(Date.now());
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

  initMarked() {
    this.markedUnlimited = this.couponPass.valid_until === null;
    this.markedQuantity = this.couponPass.purchasable === null;
    this.markedFree = this.couponPass.price === 0;
    this.markedConstraints = this.couponPass.constraints === null;
    this.markedPrivate = this.couponPass.visible_from === null;
  }

  async setCoupons() {
    try {
        this.coupons = await this.couponService.getBrokerCoupons().toPromise();
        this.packageService.getCouponsPackage(this.couponPass.id).subscribe(coupons => {

            if (this.fromEdit) {
              this.initSelectedCoupons(coupons.coupons_array);
              this.couponsAvailable = this.coupons;

              for (const cp of coupons.coupons_array) {
                this.couponsAvailable = this.couponsAvailable.filter(c => c.id !== cp.id);
              }
            }
      });

        if (!this.coupons || this.coupons.length === 0) {
        this.toastr.warning('Attualmente non puoi creare dei pacchetti: non hai coupon disponibili.', 'Non ci sono coupon disponibili.');
      }

    } catch (e) {
      console.error(e);
      this.toastr.error('C\'è stato un errore recuperando i coupon disponibili. Per favore, riprova più tardi.', 'Errore recuperando i coupon dispobili.');
    }

  }

  openModal(template: TemplateRef<any>, coupon_id = null, edit = false) {
    // this.modalCoupon = this.packageForm.get('coupons').value;

    if (coupon_id != null) {
      ////console.log('lo fai')
      coupon_id = coupon_id || this.packageForm.get('coupons').value;
      // this.modalCoupon = edit ? this.coupons.find(coupon => coupon.id == coupon_id) : this.packageForm.get('coupons').value;

      this.modalCoupon = this.coupons.find(coupon => coupon.id == coupon_id);

      if (this.modalCoupon) {
        this.maxQuantity = this.modalCoupon.purchasable === null ? this.modalCoupon.quantity : this.modalCoupon.quantity - this.modalCoupon.purchasable;
      } else {
        this.modalCoupon = this.couponAdding;
        this.maxQuantity = 2;
      }

      this.myForm = this.formBuilder.group({
        quantity: [1, Validators.compose([Validators.min(1), Validators.max(this.maxQuantity), Validators.required])]
      });

      this.isMax = this.myForm.value.quantity === this.maxQuantity;

      if (this.maxQuantity > 0) {
        this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
      } else {
        this.toastr.error('Hai già raggiunto la quantità massima acquistabile per questo coupon o è esaurito.', 'Coupon non disponibile');
      }
      this.changeCoupon = edit;
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  addToPackage(coupon: Coupon) {
    console.warn(coupon);
    if (this.changeCoupon) {
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

  initSelectedCoupons(original) {

     const array = original;
     const result = [];
     const map = new Map();
     for (const item of array) {
       if (!map.has(item.id)) {
         map.set(item.id, true);    // set any value to Map
         result.push({
           coupon: item,
           quantity: 1
         });
       } else {
         for (let i = 0; i < result.length; i++) {
           if (result[i].coupon.id == item.id) {
             result[i].quantity = result[i].quantity + 1;
           }
         }

       }
     }
     this.selectedCoupons = result;
     return result;
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

  async uploadFiles(inputElement) {

    if (inputElement.queue[0]) {

      try {
        inputElement.queue[0].upload();
        this.imagePath = inputElement.queue[0]._file.name;
        return true;
      } catch (e) {
        this.imagePath = null;
        return false;
      }
    } else {
      return true;
    }
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

  getSelectedCategories(id) {

      this.categoriesService.getCategoryCoupon(id).subscribe(cat => {
        for (const c of cat.category) {
          const category = this.categories.find(el => el.id === c.category_id);
          this.selectedCategories.push(category);
        }
        return this.selectedCategories;
      });

  }
  byPassHTML(html: string) {
    //console.log('html', html, typeof html)
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }
}
