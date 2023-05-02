import { ConfigurableModuleBuilder } from "@nestjs/common";

import type { DebuggerServiceOptionsModule } from "./debugger.module";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<DebuggerServiceOptionsModule>()
    .setClassMethodName("forRoot")
    .build();
