import { applyDecorators } from "@nestjs/common";

import { Doc } from "../../../common/doc/decorators/doc.decorator";
import { HealtchCheckResponseDto } from "../dtos/heath.dto";

export function HealthCheckDoc(): MethodDecorator {
  return applyDecorators(
    Doc<HealtchCheckResponseDto>("heath.check", {
      response: {
        serialization: HealtchCheckResponseDto,
      },
    }),
  );
}
