import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Object } from "lodash";

import { DatabaseMongoUUIDEntityAbstract } from "../../../common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract";
import { DatabaseEntity } from "../../../common/database/decorators/database.decorator";
import { ENUM_NOTIFICATION_CHANNEL } from "../constants/notification.channel.constant";
import {
  ENUM_NOTIFICATION_STATUS,
  ENUM_NOTIFICATION_TYPE,
} from "../constants/notification.constant";

export const NotificationDatabaseName = "notification";

@DatabaseEntity({ collection: NotificationDatabaseName })
export class NotificationEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ required: true, enum: ENUM_NOTIFICATION_TYPE })
  type: ENUM_NOTIFICATION_TYPE;

  @Prop({ required: true, enum: ENUM_NOTIFICATION_CHANNEL })
  channel: ENUM_NOTIFICATION_CHANNEL;

  @Prop({ required: true })
  recipient_id: string;

  @Prop({ required: true })
  sender_id: string;

  @Prop({ required: true })
  title: string;

  // store data as json
  @Prop({ required: true, type: Object })
  data: Record<string, any>;

  @Prop({ required: true })
  template_id: string;

  @Prop({ required: true, enum: ENUM_NOTIFICATION_STATUS })
  status: ENUM_NOTIFICATION_STATUS;

  @Prop()
  read_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationEntity);

export type NotificationDocument = NotificationEntity & Document;
