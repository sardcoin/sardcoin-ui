import {CouponToken} from './CouponToken';
import {User} from './User';
import {Category} from './Category';

export class Coupon {
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
  quantity?: number;
  max_quantity?: number;
  owner?: number;
  CouponTokens?: CouponToken[];
  token?: CouponToken;
  brokers?: User[];
  categories?: Category[];
  coupons?: Coupon[];
  type?: number;
  assigned?: number;

  constructor(
              id?: number,
              title?: string,
              description?: string,
              image?: string,
              timestamp?: Date | number,
              price?: number,
              valid_from?: Date | number,
              visible_from?: Date | number,
              valid_until?: Date | number,
              state?: number,
              constraints?: string,
              owner?: number,
              quantity?: number,
              purchasable?: number,
              CouponTokens?: CouponToken[],
              token?: CouponToken,
              brokers?: User[],
              categories?: Category[],
              coupons?: Coupon[],
              type?: number



  ) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.timestamp = timestamp;
    this.price = price;
    this.valid_from = valid_from;
    this.valid_until = valid_until;
    this.visible_from = visible_from;
    this.constraints = constraints;
    this.owner = owner;
    this.quantity = quantity;
    this.purchasable = purchasable;
    this.CouponTokens = CouponTokens;
    this.token = token;
    this.brokers = brokers;
    this.categories = categories;
    this.coupons = coupons;
    this.type = type;
  }

}
