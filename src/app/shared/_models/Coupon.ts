export class Coupon {
  title: string;
  description: string;
  timestamp: string;
  price: number;
  valid_from: string;
  valid_until: string;
  state: number;
  constraints: string;
  owner: number;
  consumer: number;

  constructor(
              title?: string,
              description?: string,
              timestamp?: string,
              price?: number,
              valid_from?: any,
              valid_until?: any,
              state?: number,
              constraints?: string,
              owner?: number,
              consumer?: number) {
    this.title = title;
    this.description = description;
    this.timestamp = timestamp;
    this.price = price;
    this.valid_from = valid_from;
    this.valid_until = valid_until;
    this.state = state;
    this.constraints = constraints;
    this.owner = owner;
    this.consumer = consumer;
  }

}
