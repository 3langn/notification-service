import { Module } from "@nestjs/common";

import { CommonModule } from "./common/common.module";
import { HealthModule } from "./modules/health/health.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { MessageModule } from "./modules/rmq/rmq.module";

@Module({
  imports: [CommonModule, HealthModule, MessageModule, NotificationModule],
})
export class AppModule {}
