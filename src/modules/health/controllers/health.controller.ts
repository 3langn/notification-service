import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ENUM_LOGGER_ACTION } from "../../../common/logger/constants/logger.enum.constant";
import { Logger } from "../../../common/logger/decorators/logger.decorator";
import { ApiConfigService } from "../../../shared/services/api-config.service";
import { HealthCheckDoc } from "../docs/heath.doc";

@ApiTags("health")
@Controller("/health")
export class HealthController {
  constructor(private readonly configService: ApiConfigService) {}

  @HealthCheckDoc()
  @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ["test"] })
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
