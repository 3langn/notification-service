import { applyDecorators } from "@nestjs/common";

import { DocPaging } from "../../../common/doc/decorators/doc.decorator";
import { ENUM_NOTIFICATION_TYPE } from "../constants/notification.constant";
import { ListNotificationsResponseDto } from "../dtos/notification.dto";

export const NotificationDocQueryType = [
  {
    name: "type",
    allowEmptyValue: false,
    required: true,
    type: "string",
    example: Object.values(ENUM_NOTIFICATION_TYPE).join(","),
    description: "enum value with ',' delimiter",
  },
];

export function NotificationListDoc(): MethodDecorator {
  return applyDecorators(
    DocPaging<ListNotificationsResponseDto>("notifications.list", {
      request: {
        queries: [{}],
      },
      response: {
        serialization: ListNotificationsResponseDto,
      },
    }),
  );
}
