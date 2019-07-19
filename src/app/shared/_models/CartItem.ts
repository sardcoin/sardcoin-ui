export const ITEM_TYPE = {
  COUPON: 0,
  PACKAGE: 1,
};

export class CartItem  { // TODO aggiungere prezzo
  id: number;
  quantity: number;
  price?: number;
  type: number; // Instance of ItemType TODO farlo diventare obbligatorio
}

export interface PurchasedCoupon {
  coupon_id: number;
  bought: number;
}

export let Cart: CartItem[];
