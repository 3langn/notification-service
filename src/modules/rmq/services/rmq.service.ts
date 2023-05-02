import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MessageService {
  constructor(
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async send() {
    const pattern = "ping";
    await this.amqpConnection.publish("amq.direct", pattern, { msg: "hello world" });
  }
}
