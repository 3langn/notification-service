import type { IDatabaseFindAllOptions } from "../../../common/database/interfaces/database.interface";
import type { ENUM_NOTIFICATION_CHANNEL } from "../constants/notification.channel.constant";
import type { PlaceOrderNotificationPayloadDto } from "../dtos/notification.dto";
import type { CreateNotiDto } from "../dtos/notification-create.dto";
import type { NotificationEntity } from "../entity/notification.entity";

export interface INotificationService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<NotificationEntity[]>;

  findOne(find: Record<string, any>): Promise<NotificationEntity>;

  placeOrderNotification(payload: PlaceOrderNotificationPayloadDto): Promise<void>;

  createNotification(payload: CreateNotiDto): Promise<NotificationEntity>;

  sendNotification(channel: ENUM_NOTIFICATION_CHANNEL): void;

  pushNotification(): void;

  emailNotification(): void;

  smsNotification(): void;
}
