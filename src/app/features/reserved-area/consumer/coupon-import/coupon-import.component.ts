import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {StoreService} from '../../../../shared/_services/store.service';
import {Router} from '@angular/router';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {ToastrService} from 'ngx-toastr';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';

@Component({
  selector: 'app-coupon-token',
  templateUrl: './coupon-import.component.html',
  styleUrls: ['./coupon-import.component.scss']
})
export class CouponImportComponent implements OnInit, OnDestroy {
  tokenForm: FormGroup;
  submitted = false;
  data: any;
  isScan = false;

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;
  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  constructor(
    public formBuilder: FormBuilder,
    public couponService: CouponService,
    public storeService: StoreService,
    private router: Router,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.newCamera();
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

    // bread.push(new Breadcrumb('Home', '/'));
    // bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Home', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('Import Coupon', '/reserved-area/consumer/coupon-import/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  toastValidate() {
    this.toastr.success('Coupon validated successfully');
  }

  toastError() {
    this.toastr.error('Coupon invalid!');
  }

  scan() {
    this.isScan = true;


  }


  qrCodeReadSuccess() {
    this.toastr.success('Qr-code reader successfully');
  }

  newCamera() {

    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;


      this.availableDevices = devices;
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
      console.log('permission', this.hasPermission);
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
    console.log('Selection changed: ', selectedValue);
    this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  }


}
