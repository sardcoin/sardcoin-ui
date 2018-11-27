import * as moment from 'moment';
import _date = moment.unitOfTime._date;
import {CouponToken} from './CouponToken';

export class Coupon {
  id: number;
  title: string;
  description: string;
  image: string;
  timestamp: string;
  price: number;
  visible_from: string;
  valid_from: string;
  valid_until: string;
  purchasable: number;
  constraints: string;
  owner: number;
  quantity: number;
  CouponTokens?: CouponToken[];
  token?: CouponToken;

  constructor(
              id?: number,
              title?: string,
              description?: string,
              image?: string,
              timestamp?: string,
              price?: number,
              valid_from?: any,
              visible_from?: any,
              valid_until?: any,
              state?: number,
              constraints?: string,
              owner?: number,
              quantity?: number,
              purchasable?: number,
              CouponTokens?: CouponToken[],
              token?: CouponToken
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
  }

}
