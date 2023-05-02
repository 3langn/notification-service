import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import type { IDebuggerLog } from "src/common/debugger/interfaces/debugger.interface";
import type { IDebuggerService } from "src/common/debugger/interfaces/debugger.service.interface";

@Injectable()
export class DebuggerService implements IDebuggerService {
  private logger: Logger = new Logger(DebuggerService.name);

  info(requestId: string, log: IDebuggerLog, data?: any): void {
    this.logger.log(log.description, {
      _id: requestId,
      class: log.class,
      function: log.function,
      path: log.path,
      data,
    });
  }

  debug(requestId: string, log: IDebuggerLog, data?: any): void {
    this.logger.debug(log.description, {
      _id: requestId,
      class: log.class,
      function: log.function,
      path: log.path,
      data,
    });
  }

  warn(requestId: string, log: IDebuggerLog, data?: any): void {
    this.logger.warn(log.description, {
      _id: requestId,
      class: log.class,
      function: log.function,
      path: log.path,
      data,
    });
  }

  error(requestId: string, log: IDebuggerLog, data?: any): void {
    this.logger.error(log.description, {
      _id: requestId,
      class: log.class,
      function: log.function,
      path: log.path,
      data,
      stack: data?.status === HttpStatus.NOT_FOUND ? undefined : data?.stack,
    });
  }
}
