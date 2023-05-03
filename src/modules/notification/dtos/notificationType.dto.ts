export class PlaceOrderData {
  order_id: string;
}
export class VerifyEmailData {
  user_id: string;

  email: string;

  token: string;
}

export type NotificationData = PlaceOrderData | VerifyEmailData;
