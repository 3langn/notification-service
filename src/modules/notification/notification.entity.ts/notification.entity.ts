import { Prop, SchemaFactory } from "@nestjs/mongoose";

import { DatabaseMongoUUIDEntityAbstract } from "../../../common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract";
import { DatabaseEntity } from "../../../common/database/decorators/database.decorator";
import {
  NotificationChannelEnum,
  NotificationStatusEnum,
  NotificationTypeEnum,
} from "../constants/notification.constants";

export const NotificationDatabaseName = "notification";

@DatabaseEntity({ collection: NotificationDatabaseName })
export class NotificationEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ required: true, enum: NotificationTypeEnum })
  type: NotificationTypeEnum;

  @Prop({ required: true, enum: NotificationChannelEnum })
  channel: NotificationChannelEnum;

  @Prop({ required: true })
  recipient_id: string;

  @Prop({ required: true })
  sender_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  data: Record<string, any>;

  @Prop({ required: true })
  template_id: string;

  @Prop({ required: true, enum: NotificationStatusEnum })
  status: NotificationStatusEnum;

  @Prop()
  read_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

export type NotificationDocument = Notification & Document;
