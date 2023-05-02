import type { INestApplication, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import helmet from "helmet";
import { RequestIdMiddleware } from "src/common/request/middleware/id/request.id.middleware";
import { RequestTimestampMiddleware } from "src/common/request/middleware/timestamp/request.timestamp.middleware";
import { RequestTimezoneMiddleware } from "src/common/request/middleware/timezone/request.timezone.middleware";
import { RequestUserAgentMiddleware } from "src/common/request/middleware/user-agent/request.user-agent.middleware";
import { RequestVersionMiddleware } from "src/common/request/middleware/version/request.version.middleware";

@Module({})
export class RequestMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        RequestIdMiddleware,
        RequestVersionMiddleware,
        RequestUserAgentMiddleware,
        RequestTimestampMiddleware,
        RequestTimezoneMiddleware,
      )
      .forRoutes("*");
  }
}

export const RequestMiddlewareModuleConfig = (app: INestApplication) => {
  app.enableCors();
  app.use(helmet());
};
