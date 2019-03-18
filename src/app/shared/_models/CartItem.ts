export class CartItem  { // TODO aggiungere prezzo
  id: number;
  quantity: number;
}

export interface PurchasedCoupon {
  coupon_id: number;
  bought: number;
}

export let Cart: CartItem[];
