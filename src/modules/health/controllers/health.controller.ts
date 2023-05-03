import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Response } from "../../../common/response/decorators/response.decorator";
import { ApiConfigService } from "../../../shared/services/api-config.service";
import { HealthCheckDoc } from "../docs/heath.doc";
import { HealtchCheckResponseDto } from "../dtos/heath.dto";

@ApiTags("health")
@Controller("/health")
export class HealthController {
  constructor(private readonly configService: ApiConfigService) {}

  @HealthCheckDoc()
  @Response("heath.check", {
    serialization: HealtchCheckResponseDto,
  })
  @Get()
  getHello() {
    return {
      api: "Notification Service",
      version: this.configService.appConfig.version,
      status: "OK",
      timestamp: new Date().toISOString(),
    };
  }
}
