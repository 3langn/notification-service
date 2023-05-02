import { Module } from "@nestjs/common";

import { MessageController } from "./controllers/message.controller";

@Module({
  imports: [],
  controllers: [MessageController],
  providers: [],
})
export class MessageModule {}
