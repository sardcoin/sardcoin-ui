import {Coupon} from './Coupon';
import {User} from './User';

export interface Order {
  id: number;
  consumer: number;
  purchase_time: string;
  total?: number;
  OrderCoupon?: OrderCoupon[],
  coupons?: Coupon[],
  vendor?: User
}

export interface OrderCoupon {
  id: number;
  order_id: number;
  coupon_token?: string;
  package_token?: string;
  price?: number;
}
