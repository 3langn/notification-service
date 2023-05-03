import { faker } from "@faker-js/faker";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

import { ResponseIdSerialization } from "../../../common/response/serializations/response.id.serialization";
import { ENUM_NOTIFICATION_TYPE } from "../constants/notification.constant";
import { CreateNotiDto } from "./notification-create.dto";
import type { PlaceOrderData } from "./notificationType.dto";

export class NotificationResponseDto extends ResponseIdSerialization {
  @ApiProperty({
    enum: ENUM_NOTIFICATION_TYPE,
    enumName: "NotificationTypeEnum",
    description: "Representative for the type of notification",
    example: ENUM_NOTIFICATION_TYPE.PLACE_ORDER,
    required: true,
  })
  type: ENUM_NOTIFICATION_TYPE;

  @ApiProperty({
    example: faker.date.recent(),
    required: true,
  })
  created_at: Date;

  @ApiProperty({
    example: faker.date.recent(),
    required: true,
  })
  updated_at: Date;

  @ApiProperty({
    example: faker.date.recent(),
  })
  read_at: Date;

  @Exclude()
  readonly deleted_at?: Date;
}

export class ListNotificationsResponseDto {
  @ApiProperty({
    type: [NotificationResponseDto],
    description: "List of notifications",
    required: true,
  })
  notifications: NotificationResponseDto[];
}

export class PlaceOrderNotificationPayloadDto extends CreateNotiDto {
  data: PlaceOrderData;
}
