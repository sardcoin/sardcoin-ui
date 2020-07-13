import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { EditorChangeContent, EditorChangeSelection, QuillEditor } from 'ngx-quill';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { Category } from '../../../../shared/_models/Category';
import { Coupon } from '../../../../shared/_models/Coupon';
import { User } from '../../../../shared/_models/User';
import { CategoriesService } from '../../../../shared/_services/categories.service';
import { CouponService } from '../../../../shared/_services/coupon.service';
import { StoreService } from '../../../../shared/_services/store.service';
import { UserService } from '../../../../shared/_services/user.service';
import { DateValidation } from '../coupon-create/validator/DateValidation.directive';
import { QuantityCouponValidation } from '../coupon-create/validator/QuantityCouponValidation.directive';

import * as QuillNamespace from 'quill';

const Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';

Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-edit-coupon-description',
  templateUrl: './coupon-edit-description.component.html',
  styleUrls: ['./coupon-edit-description.component.scss']
})

export class CouponEditDescriptionComponent implements OnInit, OnDestroy {
  couponForm: FormGroup;

  submitted = false;

  couponPass: Coupon;

  blured = false;
  focused = false;

  created(event: QuillEditor) {
    // tslint:disable-next-line:no-console
    // console.log('editor-created', event)
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    // console.log('editor-change', event)
  }

  focus($event) {
    // tslint:disable-next-line:no-console
    // console.log('focus', $event)
    this.focused = true;
    this.blured = false;
  }

  blur($event) {
    // tslint:disable-next-line:no-console
    // console.log('blur', $event)
    this.focused = false;
    this.blured = true;
  }

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public couponService: CouponService,
    public storeService: StoreService,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService,
    private userService: UserService,
    private categoriesService: CategoriesService,
    private sanitizer: DomSanitizer
  ) {

    this.couponService.currentMessage.subscribe(coupon => {
      this.couponPass = coupon;

      if (this.couponPass === null || this.couponPass === undefined) {
        this.router.navigate(['/reserved-area/producer/list']);
      }
    });
  }

  ngOnInit() {

    // If the coupon passed does not exist, the user is been redirect to the list of coupons
    if (this.couponPass === null || this.couponPass === undefined) {
      this.router.navigate(['/reserved-area/producer/list']);
    } else {
      this.couponForm = this.formBuilder.group({
        short_description: [this.couponPass.short_description, Validators.compose([Validators.maxLength(55000), Validators.minLength(5), Validators.required])],
        description: [this.couponPass.description, Validators.compose([Validators.maxLength(55000), Validators.minLength(5), Validators.required])]
      });
      this.addBreadcrumb();
    }
  }

  get f() {
    return this.couponForm.controls;
  }

  async saveChange() {
    this.submitted = true;

    if (this.couponForm.invalid) {
      return;
    }

    const coupon = {
      id: this.couponPass.id,
      short_description: this.f.short_description.value,
      description: this.f.description.value,
      type: 0
    };

    await this.editCouponDescription(coupon);
  }

  async editCouponDescription(coupon) {

    this.couponService.editCouponDescription(coupon)
      .subscribe(data => {
        if (data === null) {
          this.toastr.warning('Non è stato modificato alcun campo', 'Attenzione');
        } else {
          this.toastr.success('', 'Coupon modificato con successo!');
          this.router.navigate(['/reserved-area/producer/list']);
        }
      }, err => {
        // console.log(err);
        this.toastr.error('Errore di modifica', 'Errore');
      });
  }

  addBreadcrumb() {
    const bread = [] as Array<Breadcrumb>;
    bread.push(new Breadcrumb('Home', '/reserved-area/producer/'));
    bread.push(new Breadcrumb('Modifica ' + this.couponPass.title, '/reserved-area/producer/edit-description/'));
    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }


  byPassHTML(html: string) {
    // console.log('html', html, typeof html)
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
