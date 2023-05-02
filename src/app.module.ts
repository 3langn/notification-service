import { Module } from "@nestjs/common";

import { CommonModule } from "./common/common.module";
import { HealthModule } from "./modules/health/health.module";
import { MessageModule } from "./modules/rmq/rmq.module";

@Module({
  imports: [
    CommonModule,
    // AuthModule,
    HealthModule,
    MessageModule,
  ],
})
export class AppModule {}
