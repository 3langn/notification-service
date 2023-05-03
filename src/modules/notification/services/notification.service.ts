import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";

import type {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
} from "../../../common/database/interfaces/database.interface";
import {
  ENUM_QUEUE,
  ENUM_ROUTING_KEY,
  MapQueueWithExchange,
} from "../../rmq/constants/rmq.constants";
import { ENUM_NOTIFICATION_CHANNEL, MapChanel } from "../constants/notification.channel.constant";
import {
  ENUM_NOTIFICATION_STATUS,
  ENUM_NOTIFICATION_TYPE,
} from "../constants/notification.constant";
import { PlaceOrderNotificationPayloadDto } from "../dtos/notification.dto";
import type { CreateNotiDto } from "../dtos/notification-create.dto";
import { NotificationEntity } from "../entity/notification.entity";
import type { INotificationService } from "../interfaces/notification.service.interface";
import { NotificationRepository } from "../repositories/notification.repository";

@Injectable()
export class NotificationService implements INotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Subscribe AMQP
   */

  @RabbitSubscribe({
    queue: ENUM_QUEUE.NOTIFICATION,
    exchange: MapQueueWithExchange[ENUM_QUEUE.NOTIFICATION],
    routingKey: ENUM_ROUTING_KEY.PLACE_ORDER,
    queueOptions: {
      durable: false,
    },
  })
  public async placeOrder(msg: PlaceOrderNotificationPayloadDto) {
    await this.placeOrderNotification(msg);
  }

  /**
   * =====================================================================================
   */

  findOne(find: Record<string, any>): Promise<NotificationEntity> {
    return this.notificationRepository.findOne(find);
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<NotificationEntity[]> {
    return this.notificationRepository.findAll<NotificationEntity>(find, options);
  }

  async placeOrderNotification(payload: PlaceOrderNotificationPayloadDto): Promise<void> {
    const noti = await this.createNotification({
      data: payload.data,
      title: payload.title,
      channel: MapChanel[ENUM_NOTIFICATION_TYPE.PLACE_ORDER],
      recipient_id: payload.recipient_id,
      sender_id: payload.sender_id,
      template_id: "1",
      type: ENUM_NOTIFICATION_TYPE.PLACE_ORDER,
      status: ENUM_NOTIFICATION_STATUS.PENDING,
    });
    this.sendNotification(MapChanel[ENUM_NOTIFICATION_TYPE.PLACE_ORDER]);
  }

  async createNotification(
    payload: CreateNotiDto,
    options?: IDatabaseCreateOptions,
  ): Promise<NotificationEntity> {
    const noti = new NotificationEntity();
    noti.title = payload.title;
    noti.data = payload.data;
    noti.channel = payload.channel;
    noti.recipient_id = payload.recipient_id;
    noti.sender_id = payload.sender_id;
    noti.template_id = payload.template_id;
    noti.type = payload.type;
    noti.status = payload.status;
    noti.read_at = null;
    return this.notificationRepository.create(noti, options);
  }

  sendNotification(channel: ENUM_NOTIFICATION_CHANNEL): void {
    switch (channel) {
      case ENUM_NOTIFICATION_CHANNEL.EMAIL:
        this.emailNotification();
        break;
      case ENUM_NOTIFICATION_CHANNEL.SMS:
        this.smsNotification();
        break;
      case ENUM_NOTIFICATION_CHANNEL.PUSH:
        this.pushNotification();
        break;
      default:
        break;
    }
  }

  pushNotification(): void {
    console.log("push notification");
  }

  emailNotification(): void {
    console.log("email notification");
  }

  smsNotification(): void {
    console.log("sms notification");
  }
}
