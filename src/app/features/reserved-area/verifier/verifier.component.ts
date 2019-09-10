import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Result } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { ToastrService } from 'ngx-toastr';

// Local imports
import { Breadcrumb } from '../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../core/breadcrumb/breadcrumb.actions';
import { CouponService } from '../../../shared/_services/coupon.service';
import { GlobalEventsManagerService } from '../../../shared/_services/global-event-manager.service';

@Component({
  selector: 'app-verifier',
  templateUrl: './verifier.component.html',
  styleUrls: ['./verifier.component.scss']
})
export class VerifierComponent implements OnInit, OnDestroy { // TODO check after holidays if works on smartphones
  tokenForm: FormGroup;
  submitted = false;
  coupon: any;
  isScan = false;

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
    private globalEventService: GlobalEventsManagerService,
    private router: Router,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.newCamera();
    this.tokenForm = this.formBuilder.group({
      token: [undefined, Validators.required]
    });

    this.addBreadcrumb();

    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message;
    });

  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  get f(): any {
    return this.tokenForm.controls;
  }

  verify = (): void => {
    this.submitted = true;

    if (this.tokenForm.invalid) {
      return;
    }

    this.couponService.redeemCoupon(this.tokenForm.controls.token.value)
      .subscribe(result => {
        this.toastr.success('Coupon valido e vidimato con successo!', 'Coupon vidimato!');
      }, err => {
        console.error(err);
        this.toastr.error('Il token del coupon inserito non è valido oppure è scaduto.', 'Coupon non valido!');
      });
  };

  addBreadcrumb = (): void => {
    const bread = [] as Array<Breadcrumb>;

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Vidima coupon', '/reserved-area/verify/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  };

  removeBreadcrumb = (): void => {
    this.breadcrumbActions.deleteBreadcrumb();
  };

  scan = (): void => {
    this.isScan = true;
  };

  qrCodeReadSuccess = (): void => {
    this.toastr.success('Qr-code letto correttamente!');
  };

  newCamera = (): void => {
    if (this.scanner) {
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
      });
    }
  };

  handleQrCodeResult = (resultString: string): void => {
    this.qrResultString = resultString;
    this.tokenForm.controls.token.setValue(resultString);
    this.qrCodeReadSuccess();
    this.isScan = false;
    this.selectedDevice = undefined;
  };

  onDeviceSelectChange = (selectedValue: string): void => {
    this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  };

}
