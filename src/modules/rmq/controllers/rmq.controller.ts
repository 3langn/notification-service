import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Controller, Get, Logger } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ApiConfigService } from "../../../shared/services/api-config.service";
import { ENUM_QUEUE, ENUM_ROUTING_KEY, MapQueueWithExchange } from "../constants/rmq.constants";
import { MessageService } from "../services/rmq.service";

@ApiTags("message")
@Controller("/message")
export class MessageController {
  private readonly logger = new Logger(MessageController.name);

  constructor(
    private readonly configService: ApiConfigService,
    private readonly messageService: MessageService,
  ) {}

  @RabbitSubscribe({
    queue: ENUM_QUEUE.NOTIFICATION,
    exchange: MapQueueWithExchange[ENUM_QUEUE.NOTIFICATION],
    routingKey: ENUM_ROUTING_KEY.PING,
    queueOptions: {
      durable: false,
    },
  })
  public async pong(msg: {}) {
    this.logger.log(`Received message: ${JSON.stringify(msg)}`);
  }

  @Get("/ping")
  async ping() {
    const result = await this.messageService.send();
    return result;
  }
}
