import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { RmqContext } from "@nestjs/microservices";

@Injectable()
export class MessageService {
  constructor(private readonly configService: ConfigService) {}

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
