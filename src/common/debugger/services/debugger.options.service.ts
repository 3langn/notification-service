import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { IDebuggerOptionService } from "src/common/debugger/interfaces/debugger.options-service.interface";
import type { LoggerOptions } from "winston";
import * as winston from "winston";

@Injectable()
export class DebuggerOptionService implements IDebuggerOptionService {
  constructor(private configService: ConfigService) {}

  createLogger(): LoggerOptions {
    const loggerOptions: LoggerOptions = {
      format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
      transports: new winston.transports.Console(),
    };

    return loggerOptions;
  }
}
