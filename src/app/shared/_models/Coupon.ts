import * as moment from 'moment';
import _date = moment.unitOfTime._date;

export class Coupon {
  id: number;
  title: string;
  description: string;
  image: string;
  timestamp: string;
  price: number;
  valid_from: string;
  valid_until: string;
  state: number;
  constraints: string;
  owner: number;
  consumer: number;
  quantity: number;
  token: string

  constructor(
              id?: number,
              title?: string,
              description?: string,
              image?: string,
              timestamp?: string,
              price?: number,
              valid_from?: any,
              valid_until?: any,
              state?: number,
              constraints?: string,
              owner?: number,
              consumer?: number,
              quantity?: number,
               ) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.timestamp = timestamp;
    this.price = price;
    this.valid_from = valid_from;
    this.valid_until = valid_until;
    this.state = state;
    this.constraints = constraints;
    this.owner = owner;
    this.consumer = consumer;
    this.quantity = quantity;


  }

}
