import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BreadcrumbActions} from '../../../core/breadcrumb/breadcrumb.actions';
import {ToastrService} from 'ngx-toastr';
import {CouponService} from '../../../shared/_services/coupon.service';
import {StoreService} from '../../../shared/_services/store.service';
import {Breadcrumb} from '../../../core/breadcrumb/Breadcrumb';
import {select} from '@angular-redux/store';
import { BrowserQRCodeReader, VideoInputDevice } from '@zxing/library';

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
  constructor(
    public formBuilder: FormBuilder,
    public couponService: CouponService,
    public storeService: StoreService,
    private router: Router,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.tokenForm = this.formBuilder.group({
      token: [null, Validators.required]
    });

    this.addBreadcrumb();

  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  get f() {
    return this.tokenForm.controls;
  }

  verifier() {
    this.submitted = true;

    this.couponService.getTotalCoupons().subscribe(coupons => {
      const cp = JSON.parse(JSON.stringify(coupons));
      // console.log('cp.keys.length', cp.length);
      console.log('cp', cp);

      let length = 1;
      let isValidate = false;
      for ( const i of cp) {


        length ++;
        if (i.state === 1 && i.token === this.tokenForm.value.token ) {
          isValidate = true;
          this.coupon = {
            token: this.tokenForm.value.token,
            verifier: this.storeService.getId(),
            state: 2,
          };

          this.couponService.verifierCoupon(this.coupon).subscribe(
            (data) => {
              this.toastValidate();
              this.router.navigate(['/reserved-area/verifier']);
              return;
            }, error => {
              this.toastError();

              console.log(error);
            }
          );
        } else if (length === Number(cp.length) && !isValidate) {
          // console.log('non trovato');
          this.toastError();
        }
      }
    }, error1 => {
      this.toastError()

      ;
      console.log(error1);
    });
  }
  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Verifier', '/reserved-area/verifier/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  toastValidate() {
    this.toastr.success( 'Coupon verifier successfully');
  }

  toastError() {
    this.toastr.error( 'Coupon invalid!');
  }

  scan() {
    this.isScan = true;
    const codeReader = new BrowserQRCodeReader();

    codeReader.getVideoInputDevices()
      .then(videoInputDevices => {
        videoInputDevices.forEach(
          device => {
            console.log(`${device.label}, ${device.deviceId}`);
            const firstDeviceId = videoInputDevices[0].deviceId;

            codeReader.decodeFromInputVideoDevice(firstDeviceId, 'video')
              .then(result => {
                console.log(result.getText());
                this.tokenForm.controls.token.setValue((result.getText()));
                this.isScan = false;
              })
              .catch(err => console.error(err));
          }
        );
      })
      .catch(error => console.error(error));



  }

}
