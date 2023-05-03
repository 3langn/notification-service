import { Module } from "@nestjs/common";

import { NotificationController } from "./controllers/notification.controller";
import { NotificationRepositoryModule } from "./repositories/notification.repository.module";
import { NotificationService } from "./services/notification.service";

@Module({
  imports: [NotificationRepositoryModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
