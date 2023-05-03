import type { ENUM_NOTIFICATION_CHANNEL } from "../constants/notification.channel.constant";
import type {
  ENUM_NOTIFICATION_STATUS,
  ENUM_NOTIFICATION_TYPE,
} from "../constants/notification.constant";
import type { NotificationData } from "./notificationType.dto";

export class CreateNotiDto {
  title: string;

  channel: ENUM_NOTIFICATION_CHANNEL;

  data: NotificationData;

  recipient_id: string;

  sender_id: string;

  template_id: string;

  type: ENUM_NOTIFICATION_TYPE;

  status: ENUM_NOTIFICATION_STATUS;
}
