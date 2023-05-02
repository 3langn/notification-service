import { Controller, Logger } from "@nestjs/common";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";

import { ApiConfigService } from "../../../shared/services/api-config.service";
import { ENUM_MESSAGE_PATTERN } from "../constants/message.constants";
import { MessageService } from "../services/message.service";

@Controller()
export class MessageController {
  private readonly logger = new Logger(MessageController.name);

  constructor(
    private readonly configService: ApiConfigService,
    private readonly messageService: MessageService,
  ) {}

  @MessagePattern(ENUM_MESSAGE_PATTERN.PING)
  async pong(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log("pong", data);
  }
}
