import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {Coupon} from '../../../../shared/_models/Coupon';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {single} from 'rxjs/internal/operators';

@Component({
  selector: 'app-feature-reserved-area-coupon-list',
  templateUrl: './coupon-list.component.html'
})

export class FeatureReservedAreaCouponListComponent implements OnInit, OnDestroy {

  couponArray: any;
  couponRequest: any;
  couponArrayTitleAndQuantity: any = [];
  arrayTitleDuplicate  = [];
  numberCoupon = 0;
  @Input() couponPass: Coupon;

  constructor(
    private couponService: CouponService,
    private router: Router,
    private breadcrumbActions: BreadcrumbActions,
    private _sanitizer: DomSanitizer
    ) {
  }

  ngOnInit(): void {
    this.control();
    console.log('vedi qua dopo tutto in ngOnInit', this.couponArrayTitleAndQuantity);

    this.addBreadcrumb();
  }


  onEdit(coupon: any) {
    this.couponService.setCoupon(coupon);
    console.log('coupon.id: ' + coupon.id );
  }

  onDelete(coupon_id: number) {
    console.log('coupon_id: ', coupon_id);
    this.couponService.deleteCoupon(coupon_id);
    // window.location.reload();
    this.couponService.getAllCoupons().subscribe(
      data => {
        console.log('getAllByUser ' + data);
        this.couponArray = data;
      },
      error => console.log(error)
    );


  // this.control();

  }
  onDetails() {

  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Producer', '/reserved-area/producer/'));
    bread.push(new Breadcrumb('My coupons', '/reserved-area/producer/list/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  imageUrl(path) {
    // let subs = path.substr(path.lastIndexOf('\\')+1);
    // return correct address and port backend plus name image
    return this._sanitizer.bypassSecurityTrustUrl('http://127.0.0.1:3000/' + path);
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Free';
    }

    return '€ ' + price;
  }

  getQuantity(coupon) {
    // console.log('coupon', coupon);
    // console.log('in getQuantity', this.couponArrayTitleAndQuantity);
    //
    //
    // console.log('in getQuantityQuantity', Object.values(this.couponArrayTitleAndQuantity)[0]);
    //
    // for (let y = 0; y <= Object.keys(this.couponArrayTitleAndQuantity).length; y++) {
    //
    //   console.log('titloli:', Object.keys(this.couponArrayTitleAndQuantity)[y]);
    //   console.log('titloli coupon:', coupon.title.toString());
    //
    //   console.log('quantity', Object.keys(this.couponArrayTitleAndQuantity)[y]);
    //
    //   if (coupon.title == Object.keys(this.couponArrayTitleAndQuantity)[y]) {
    //     console.log('title dentro if', this.couponArrayTitleAndQuantity[y]);
    //     console.log('quantity dentro if', this.couponArrayTitleAndQuantity[y]);
    //     return Object.values(this.couponArrayTitleAndQuantity)[y];
    //   } else {
    //     // return 1;
    //   }
    //
    //   }
    //
    // return 1;

    return this.couponArray.quantity;
    }




  control() {

    this.couponService.getAllCoupons().subscribe(
      data => {
        console.log('getAllByUser ' + data);
        this.couponRequest = data;
        const arrayTitleAndQuantityDuplicate = [];        // filter duplicate
        this.numberCoupon = (JSON.parse( JSON.stringify(this.couponRequest)).length);
        this.couponArray = this.couponRequest.filter((value) => {

            const rs = !this[value.title] && (this[value.title] = true);

            if (!rs) {
              if (!this.arrayTitleDuplicate.includes(value.title)) {
                this.arrayTitleDuplicate.push(value.title);
              }
            }


            return rs;
          }

         , ) ;
        for (let i = 0; i < JSON.parse( JSON.stringify(this.couponRequest)).length; i++) {
          for (let y = 0; y < this.arrayTitleDuplicate.length; y++) {
            if (this.couponRequest[i].title === this.arrayTitleDuplicate[y]) {
              arrayTitleAndQuantityDuplicate.push(this.arrayTitleDuplicate[y]);
              // this.couponArrayTitleAndQuantity.push(this.arrayTitleDuplicate[y]);
            }
          }
        }
        const map = arrayTitleAndQuantityDuplicate.reduce(function(prev, cur) {

            // const map = this.couponArrayTitleAndQuantity.reduce(function(prev, cur) {
          prev[cur] = (prev[cur] || 0) + 1;
          return prev;
        }, {});
        console.log(this.couponArrayTitleAndQuantity);
        this.couponArrayTitleAndQuantity = map;
        console.log('title and quantity', this.couponArrayTitleAndQuantity);
        console.log('duplicate', this.arrayTitleDuplicate);

      },
      error => console.log(error)
    );


    // console.log('fuori', this.couponArrayTitleAndQuantity);
  }


}
