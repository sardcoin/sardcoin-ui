import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

// Local imports
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { CouponService } from '../../../../shared/_services/coupon.service';
import { GlobalEventsManagerService } from '../../../../shared/_services/global-event-manager.service';

@Component({
  selector: 'app-coupon-token',
  templateUrl: './coupon-import.component.html',
  styleUrls: ['./coupon-import.component.scss']
})
export class CouponImportComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  tokenForm: FormGroup;
  submitted = false;
  data: any;
  isScan = false;

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;
  availableDevices: Array<MediaDeviceInfo>;
  selectedDevice: MediaDeviceInfo = undefined;
  desktopMode: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public couponService: CouponService,
    private router: Router,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService,
    private globalEventService: GlobalEventsManagerService
  ) {
  }

  ngOnInit(): void {
    this.newCamera();
    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message;
    });
    this.tokenForm = this.formBuilder.group({
      token: [undefined, Validators.required]
    });

    this.addBreadcrumb();
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  get f(): any {
    return this.tokenForm.controls;
  }

  importToken = (): void => {
      this.submitted = true;

      this.data = {
          token: this.tokenForm.value.token
      };

      if (this.tokenForm.invalid) {
          return;
      }
      this.couponService.isCouponFromToken(this.data.token).subscribe(isTokenCoupon => {
          console.log('isTokenCoupon', isTokenCoupon)
        this.blockUI.start('Attendi la registrazione su Blockchain'); // Start blocking

        if (isTokenCoupon.error === true) {
          this.importPackage();
        } else {
          this.importCoupon();
        }
        this.blockUI.stop(); // Stop blocking

      });

  };

  importPackage = (): void => {

        this.couponService.importOfflinePackage(this.data)
            .subscribe(data => {
                    if (data !== null) {
                        this.toastr.success('Coupon importato con successo!');
                        this.router.navigate(['/bought']);
                    } else {
                        this.toastError();
                    }
                }, error => {
                    this.toastError();
                    console.log(error);
                }
            );
    };

  importCoupon = (): void => {

    this.couponService.importOfflineCoupon(this.data)
      .subscribe(data => {
          if (data !== null) {
            this.toastr.success('Coupon importato con successo!');
            this.router.navigate(['/bought']);
          } else {
            this.toastError();
          }
        }, error => {
          this.toastError();
          console.log(error);
        }
      );
  };

  addBreadcrumb = (): void => {
    const bread: Array<Breadcrumb> = [];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Importa coupon', '/coupon-import/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  };

  removeBreadcrumb = (): void => {
    this.breadcrumbActions.deleteBreadcrumb();
  };

  toastError = (): void => {
    this.toastr.error('Coupon non valido!');
  };

  scan = (): void => {
    this.isScan = true;
  };

  newCamera = (): void => {
    if (this.scanner) {
      this.scanner.camerasFound.subscribe((devices: Array<MediaDeviceInfo>) => {
        this.hasCameras = true;
        this.availableDevices = devices;
      });

      this.scanner.camerasNotFound.subscribe(() => {
        console.error('Errore fotocamera.');
      });

      this.scanner.permissionResponse.subscribe((answer: boolean) => {
        this.hasPermission = answer;
      });
    }
  };

  handleQrCodeResult = (resultString: string): void => {
    this.qrResultString = resultString;
    this.tokenForm.controls.token.setValue(resultString);
    this.toastr.success('Qr-code letto correttamente!');
    this.isScan = false;
    this.selectedDevice = undefined;
  };

  onDeviceSelectChange = (selectedValue: string): void => {
    this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  };

}
