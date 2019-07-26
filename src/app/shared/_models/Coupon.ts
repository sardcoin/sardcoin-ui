import {CouponToken} from './CouponToken';
import {User} from './User';
import {Category} from './Category';

export interface Package extends Coupon {
  package: PackItem[]
}

export interface Coupon {
  id?: number;
  title: string;
  description: string;
  image: string;
  timestamp?:  Date | number;
  price: number;
  visible_from: Date | number;
  valid_from: Date | number;
  valid_until: Date | number;
  purchasable: number;
  constraints: string;
  qrToken?: any;
  quantity?: number;
  quantity_pack?: number;
  max_quantity?: number;
  owner?: number;
  CouponTokens?: CouponToken[] | string;
  token?: CouponToken;
  purchase_time?: Date | number;
  brokers?: User[];
  categories?: Category[];
  coupons?: Coupon[];
  type?: number;
  assigned?: number;
}

export interface PackItem {
  coupon: Coupon;
  quantity: number;
}
