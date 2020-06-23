import {Component, OnDestroy, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { EditorChangeContent, EditorChangeSelection, QuillEditor } from 'ngx-quill';
import {Coupon} from '../../../../shared/_models/Coupon';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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


import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);


@Component({
  selector: 'app-feature-reserved-area-coupon-create',
  templateUrl: './coupon-create.component.html',
  styleUrls: ['./coupon-create.component.scss']
})

export class FeatureReservedAreaCouponCreateComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

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



  couponForm: FormGroup;
  hide = false;
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
    private sanitizer: DomSanitizer,
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
      title: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(80), Validators.required])],
      short_description: [undefined, Validators.compose([Validators.minLength(5), Validators.maxLength(255), Validators.required])],
      description: [undefined, Validators.compose([Validators.minLength(5), Validators.maxLength(55000), Validators.required])],
      image: [this.imagePath, Validators.required ],
      price: [1, Validators.compose([Validators.min(1), Validators.required])],
      published_from: [new Date().setMinutes(new Date().getMinutes() + 10)],
      categories: [this.selectedCategories],
      broker: [this.selectedBroker],
      // delay: [24, Validators.min(24)],
      valid_from: [new Date(), Validators.required],
      valid_until: [null],
      valid_until_empty: [this.markedUnlimited],
      quantity: [1, Validators.required],
      constraints: [null],
      purchasable: [1, Validators.required]
    }, {
      validator: Validators.compose([DateValidation.CheckDateDay, QuantityCouponValidation.CheckQuantityCoupon])
    });
    }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  get f() {
    return this.couponForm.controls;
  }

  async saveCoupon() {
    this.blockUI.start('Attendi la registrazione su Blockchain'); // Start blocking

    this.submitted = true;
    const uploadDone = await this.uploadFiles(this.uploader);
    if (!uploadDone) {
      this.toastr.error('Errore imprevisto durante il caricamento dell\'immagine.', 'Errore caricamento immagine');
      this.blockUI.stop(); // Stop blocking

      return;
    }

      // It stops here if form is invalid or not upload image
    if (this.couponForm.invalid || this.imagePath == null) {
      console.log('this.couponForm.invalid', this.couponForm.controls)
      this.blockUI.stop(); // Stop blocking

      return;
    }
    const visibleTime = new Date(this.f.published_from.value).getTime() < new Date().setMinutes(new Date().getMinutes() + 10) ? new Date().setMinutes(new Date().getMinutes() + 10) : this.f.published_from.value;
    console.log(visibleTime, new Date(this.f.published_from.value).getTime(), new Date().setMinutes(new Date().getMinutes() + 10))
    const coupon: Coupon = {
      title: this.f.title.value,
      short_description: this.f.short_description.value,
      description: this.f.description.value,
      image: this.imagePath,
      price: this.markedFree ? 0 : this.f.price.value,
      visible_from: this.markedPrivate ? null : (new Date(visibleTime)).getTime().valueOf(),
      valid_from: (new Date(this.f.valid_from.value)).getTime().valueOf(),
      valid_until: this.markedUnlimited ? null : (new Date(this.f.valid_until.value)).getTime().valueOf(),
      constraints: this.markedConstraints ? null : this.f.constraints.value,
      purchasable: this.markedQuantity ? null : this.f.purchasable.value,
      quantity: this.f.quantity.value,
      brokers: this.selectedBroker,
      type: 0,
      categories: this.selectedCategories

    };
    //console.log('broker selezionati', this.selectedBroker);
    this.addCoupon(coupon);
  }

/*
  changeDate() {
    this.couponForm.get('published_from').setValue(new Date().setHours(new Date().getHours() + this.couponForm.get('delay').value));
  }

changeDelay() {
  if (new Date(this.couponForm.get('published_from').value).getTime() > new Date().valueOf()) {
    setTimeout(() => {
      const value = (new Date(this.couponForm.get('published_from').value).getTime() - new Date().valueOf()) / 3600000;
      this.couponForm.get('delay').setValue(Math.floor(value));
      }, 200
    );
  }
  else {
    this.couponForm.get('delay').setValue(24);
  }
}
*/

  addCoupon(coupon: Coupon) {
    this.couponService.create(coupon)
      .subscribe(data => {

        if (data['created']) {
          this.toastr.success('', 'Coupon creato con successo!');
          this.router.navigate(['/reserved-area/producer/list']);
          this.blockUI.stop(); // Stop blocking

        } else {
          this.toastr.error('Errore imprevisto durante la creazione del coupon.', 'Errore durante la creazione');
          this.blockUI.stop(); // Stop blocking

        }
      }, err => {
        ////console.log(err);
        this.blockUI.stop(); // Stop blocking

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
      /*case 'publishNow':
        if (e.target.checked) {
            this.couponForm.get('published_from').disable();
            this.couponForm.get('delay').disable();
            this.couponForm.get('published_from').setValue(new Date().setMinutes(new Date().getMinutes() + 10));
            this.couponForm.get('delay').setValue(24);
            this.bgColorPrivate = '#E4E7EA';
        } else {
            this.couponForm.get('published_from').enable();
            this.couponForm.get('delay').enable();
            this.couponForm.get('published_from').setValue(new Date().setHours(new Date().getHours() + 24));
            this.bgColorPrivate = '#FFF';
          }*/
    }
  }

  setAddress(addressObtained) {
    this.couponForm.get('constraints').setValue(addressObtained);
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Crea coupon', '/reserved-area/producer/create/'));

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
        return true;
      } catch (e) {
        ////console.log('error upload image', e);
        this.imagePath = null;
        return false;
      }

    }


  }

  byPassHTML(html: string) {
    //console.log('html', html, typeof html)
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }


}


