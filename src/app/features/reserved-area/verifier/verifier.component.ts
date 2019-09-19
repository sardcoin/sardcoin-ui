import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Result } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { Breadcrumb } from '../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../core/breadcrumb/breadcrumb.actions';
import { Coupon } from '../../../shared/_models/Coupon';
import { CouponService } from '../../../shared/_services/coupon.service';
import { GlobalEventsManagerService } from '../../../shared/_services/global-event-manager.service';
import { StoreService } from '../../../shared/_services/store.service';

@Component({
  selector: 'app-verifier',
  templateUrl: './verifier.component.html',
  styleUrls: ['./verifier.component.scss']
})
export class VerifierComponent implements OnInit, OnDestroy {
  tokenForm: FormGroup;
  submitted = false;
  coupon: any;
  isScan = false;
  modalCoupons: any;
  modalRef: BsModalRef;

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;
  availableDevices: Array<MediaDeviceInfo>;
  selectedDevice: MediaDeviceInfo;
  desktopMode: boolean;

  qrResult;

  constructor(
    public formBuilder: FormBuilder,
    public couponService: CouponService,
    public storeService: StoreService,
    private globalEventService: GlobalEventsManagerService,
    private router: Router,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.newCamera();
    this.tokenForm = this.formBuilder.group({
      token: [null, Validators.required]
    });

    this.addBreadcrumb();

    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message;
    });

  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  get f() {
    return this.tokenForm.controls;
  }

  verify(template?: TemplateRef<any>) {
    this.submitted = true;

    if (this.tokenForm.invalid) {
      return;
    }

    this.couponService.redeemCoupon(this.tokenForm.controls.token.value)
      .subscribe(result => {
        if (result) {
            if (result.coupons) {
                this.toastr.warning('Vidimare il coupon desiderato!', 'Coupon di tipo pacchetto');

                console.log('result', result);
                this.modalCoupons = result.coupons;
                console.log('this.modalCoupons', this.modalCoupons);
                // this.openModal(template, this.modalCoupons);
            } else {
                this.toastr.success('Coupon valido e vidimato con successo!', 'Coupon valido');

            }
        } else {
            this.toastr.error('Coupon non valido o scaduto.', 'Coupon non valido!');
          }
      }, err => {
        console.error(err);
        this.toastr.error('Coupon non valido o scaduto.', 'Coupon non valido!');
      });
  }

  verifyFromPackage(token) {
        this.submitted = true;

        if (this.tokenForm.invalid) {
            return;
        }

        this.couponService.redeemCoupon(token)
            .subscribe(result => {
                if (result) {
                  this.verifyCouponFromModal(token)
                  this.toastr.success('Coupon valido e vidimato con successo!', 'Coupon valido');
                } else {
                    this.toastr.error('Coupon non valido o scaduto.', 'Coupon non valido!');
                }
            }, err => {
                console.error(err);
                this.toastr.error('Coupon non valido o scaduto.', 'Coupon non valido!');
            });
  }

  addBreadcrumb() {
    const bread = [] as Array<Breadcrumb>;

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Vidima coupon', '/reserved-area/verify/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  scan() {
    this.isScan = true;
  }

  qrCodeReadSuccess() {
    this.toastr.success('Qr-code letto correttamente!');
  }

  newCamera() {

    this.scanner.camerasFound.subscribe((devices: Array<MediaDeviceInfo>) => {
      this.hasCameras = true;

      this.availableDevices = devices;
    });

    this.scanner.camerasNotFound.subscribe((devices: Array<MediaDeviceInfo>) => {
      console.error('Errore fotocamera.');
    });

    this.scanner.scanComplete.subscribe((result: Result) => {
      this.qrResult = result;
      console.log(result);
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
      // console.log('permission', this.hasPermission );
    });

  }

  handleQrCodeResult(resultString: string) {
    console.log('Result: ', resultString);
    this.qrResultString = resultString;
    this.tokenForm.controls.token.setValue(resultString);
    this.qrCodeReadSuccess();
    this.isScan = false;
    this.selectedDevice = null;
  }

  onDeviceSelectChange(selectedValue: string) {
    // console.log('Selection changed: ', selectedValue);
    this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  }

  openModal(template: TemplateRef<any>, coupons: any) {
    console.log('cp', coupons);
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});

  }

  verifyCouponFromModal(token) {
    const modalRefresh = this.modalCoupons;
    for (const arr of modalRefresh) {
      for (const cp of arr) {
        if (cp.token === token) {

          arr.pop();

        }

      }

    }
    this.modalCoupons = modalRefresh;
    this.controlEmptyModalCoupon();
    console.log('this.modalCoupons dopo', this.modalCoupons);
  }

  closeModal() {

      this.modalRef.hide();

  }

  exitPackage() {
    this.modalCoupons = undefined;
    }

  controlEmptyModalCoupon() {

    let empty;
    for (const arr of this.modalCoupons) {
      for (const cp of arr) {
        if (cp.length === 0) {
          empty = true;
        } else {
          empty = false;
        }
      }
    }
    console.log('empty', empty)
    if (empty === undefined) {
      this.modalCoupons = undefined;
    }
  }
}
