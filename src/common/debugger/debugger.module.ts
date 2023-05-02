import type { DynamicModule, ForwardReference, Provider, Type } from "@nestjs/common";
import { Global, Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";

// import { winstonConfig } from "./constants/debugger.constant";
import { DebuggerOptionsModule } from "./debugger.options.module";
import { DebuggerMiddlewareModule } from "./middleware/debugger.middleware.module";
import { DebuggerOptionService } from "./services/debugger.options.service";
import { DebuggerService } from "./services/debugger.service";

export interface DebuggerServiceOptionsModule {
  appDebug: boolean;
}
@Global()
@Module({})
export class DebuggerModule {
  static forRoot(): DynamicModule {
    const providers: Provider<any>[] = [];
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] =
      [];
    // if (process.env.APP_DEBUG === "true") {
    // }
    // imports.push(WinstonModule.forRoot(winstonConfig));
    if (true) {
      providers.push(DebuggerService);
      imports.push(
        WinstonModule.forRootAsync({
          inject: [DebuggerOptionService],
          imports: [DebuggerOptionsModule],
          useFactory: (debuggerOptionsService: DebuggerOptionService) =>
            debuggerOptionsService.createLogger(),
        }),
      );
    }
    return {
      module: DebuggerModule,
      providers,
      exports: providers,
      controllers: [],
      imports: [...imports, DebuggerMiddlewareModule],
    };
  }
}
