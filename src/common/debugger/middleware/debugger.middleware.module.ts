import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Module } from "@nestjs/common";

import {
  DebuggerHttpMiddleware,
  DebuggerHttpResponseMiddleware,
  DebuggerHttpWriteIntoConsoleMiddleware,
} from "./http/debugger.http.middleware";

@Module({})
export class DebuggerMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        DebuggerHttpResponseMiddleware,
        DebuggerHttpMiddleware,
        DebuggerHttpWriteIntoConsoleMiddleware,
      )
      .forRoutes("*");
  }
}
