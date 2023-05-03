import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "../../../common/pagination/constants/pagination.enum.constant";

export enum ENUM_NOTIFICATION_STATUS {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
  READ = "read",
}

export enum ENUM_NOTIFICATION_CHANNEL {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
}

export enum ENUM_NOTIFICATION_TYPE {
  PASSWORD_RESET = "password_reset",
  EMAIL_VERIFICATION = "email_verification",
  EMAIL_CONFIRMATION = "email_confirmation",
  PLACE_ORDER = "place_order",
  CANCEL_ORDER = "cancel_order",
  UPDATE_ORDER = "update_order",
  CANCLE_ORDER = "cancle_order",
}

export const NOTIFICATION_DEFAULT_ORDER_BY = "created_at";
export const NOTIFICATION_DEFAULT_ORDER_DIRECTION = ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const NOTIFICATION_DEFAULT_PER_PAGE = 20;
export const NOTIFICATION_DEFAULT_AVAILABLE_ORDER_BY = ["created_at"];
export const NOTIFICATION_DEFAULT_AVAILABLE_SEARCH = ["title"];
export const NOTIFICATION_DEFAULT_IS_ACTIVE = [true, false];
export const NOTIFICATION_DEFAULT_TYPE = Object.values(ENUM_NOTIFICATION_TYPE);
