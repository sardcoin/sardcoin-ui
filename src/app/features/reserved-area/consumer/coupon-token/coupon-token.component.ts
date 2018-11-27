import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {StoreService} from '../../../../shared/_services/store.service';
import {Router} from '@angular/router';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {ToastrService} from 'ngx-toastr';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BrowserQRCodeReader} from '@zxing/library';

@Component({
  selector: 'app-coupon-token',
  templateUrl: './coupon-token.component.html',
  styleUrls: ['./coupon-token.component.scss']
})
export class CouponTokenComponent implements OnInit, OnDestroy {
  tokenForm: FormGroup;
  submitted = false;
  data: any;
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
  import() {
    this.submitted = true;




       this.data = {
         token: this.tokenForm.value.token,
       };

       this.couponService.importOfflineCoupon(this.data).subscribe(
         (data) => {
           if (data !== null) {
             this.toastValidate();
             this.router.navigate(['/reserved-area/consumer/bought']);
             return;
           } else {
             this.toastError();
             return;
           }
         }, error => {
           this.toastError();

           console.log(error);
           return;
         }
       );



  }
  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('Validate Coupons', '/reserved-area/consumer/coupon-token/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  toastValidate() {
    this.toastr.success( 'Coupon validated successfully');
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
                codeReader.reset();
                this.qrCodeReadSuccess();
              })
              .catch(err => console.error(err));
          }
        );
      })
      .catch(error => console.error(error));



  }


  qrCodeReadSuccess() {
    this.toastr.success( 'Qr-code reader successfully');
  }

}
