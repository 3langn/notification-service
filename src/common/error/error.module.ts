import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { DebuggerModule } from "src/common/debugger/debugger.module";

import { ErrorHttpFilter } from "./filters/error.http.filter";
import { ErrorMetaGuard } from "./guards/error.meta.guard";

@Module({
  imports: [DebuggerModule.forRoot()],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorHttpFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ErrorMetaGuard,
    },
  ],
})
export class ErrorModule {}
