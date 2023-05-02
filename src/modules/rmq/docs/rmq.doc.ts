import { applyDecorators } from "@nestjs/common";

import { Doc } from "../../../common/doc/decorators/doc.decorator";
import { MessagePingResponseDto } from "../dto/rmq.dto";

export function HealthCheckDoc(): MethodDecorator {
  return applyDecorators(
    Doc<MessagePingResponseDto>("message.ping", {
      response: {
        serialization: MessagePingResponseDto,
      },
    }),
  );
}
