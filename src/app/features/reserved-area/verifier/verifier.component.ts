import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BreadcrumbActions} from '../../../core/breadcrumb/breadcrumb.actions';
import {ToastrService} from 'ngx-toastr';
import {CouponService} from '../../../shared/_services/coupon.service';
import {StoreService} from '../../../shared/_services/store.service';
import {Breadcrumb} from '../../../core/breadcrumb/Breadcrumb';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {GlobalEventsManagerService} from '../../../shared/_services/global-event-manager.service';
import {Result} from '@zxing/library';

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

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;
  availableDevices: MediaDeviceInfo[];
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
    private toastr: ToastrService
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

  verify() {
    this.submitted = true;

    if (this.tokenForm.invalid) {
      return;
    }

    this.couponService.redeemCoupon(this.tokenForm.controls['token'].value)
      .subscribe(result => {
        this.toastr.success('Coupon valido e vidimato con successo!', 'Coupon valido');
      }, err => {
        console.error(err);
        this.toastr.error('Coupon non valido o scaduto.', 'Coupon non valido!');
      });
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

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

    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;


      this.availableDevices = devices;
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
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
    this.tokenForm.controls['token'].setValue(resultString);
    this.qrCodeReadSuccess();
    this.isScan = false;
    this.selectedDevice = null;
  }

  onDeviceSelectChange(selectedValue: string) {
    // console.log('Selection changed: ', selectedValue);
    this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  }

}
