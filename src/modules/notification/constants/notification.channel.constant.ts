import { ENUM_NOTIFICATION_TYPE } from "./notification.constant";

export enum ENUM_NOTIFICATION_CHANNEL {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
}

export const MapChanel = {
  [ENUM_NOTIFICATION_TYPE.PLACE_ORDER]: ENUM_NOTIFICATION_CHANNEL.PUSH,
};
