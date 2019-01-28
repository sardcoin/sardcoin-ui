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
  ) { }

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

  verifier() { // TODO to check
    this.submitted = true;

    this.couponService.getTotalCoupons().subscribe(coupons => {
      const cp = JSON.parse(JSON.stringify(coupons));

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
          this.toastError();
        }
      }
    }, error1 => {
      this.toastError();
      console.log(error1);
    });
  }
  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Area riservata', '/reserved-area/'));
    bread.push(new Breadcrumb('Vidimatore', '/reserved-area/verifier/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  toastValidate() {
    this.toastr.success( 'Coupon valido e vidimato con successo!', 'Coupon valido');
  }

  toastError() {
    this.toastr.error( 'Coupon non valido o scaduto.', 'Coupon non valido!');
  }

  scan() {
    this.isScan = true;
  }

  qrCodeReadSuccess() {
    this.toastr.success( 'QR code acquisito correttamente!');
  }


  newCamera() {

    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;


      this.availableDevices = devices;
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('Errore fotocamera.');
    });

    this.scanner.scanComplete.subscribe((result: Result) => {this.qrResult = result; console.log(result)});

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
      // console.log('permission', this.hasPermission );
    });

  }

  handleQrCodeResult(resultString: string) {
    console.log(resultString);
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
