import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";

import { ApiConfigService } from "../../shared/services/api-config.service";
import { SharedModule } from "../../shared/shared.module";
import { ENUM_EXCHANGE } from "./constants/rmq.constants";
import { MessageController } from "./controllers/rmq.controller";
import { MessageService } from "./services/rmq.service";

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService: ApiConfigService) => ({
        uri: configService.rabbitmqConfig.uri,
        uriEncoded: true,
        exchanges: [
          {
            name: ENUM_EXCHANGE.NOTIFICATION,
            type: "direct",
          },
        ],
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
      }),
      inject: [ApiConfigService],
      imports: [SharedModule],
    }),
    MessageModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
