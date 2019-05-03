export interface Order {
  id: number;
  consumer: number;
  purchase_time: string;
  OrderCoupon?: OrderCoupon[],
  total?: number;

}

export interface OrderCoupon {
  coupon_id: number;
  quantity: number;
  price: number;
}
