import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Reflector } from "@nestjs/core";
import type { Response } from "express";
import type { Observable } from "rxjs";
import { tap } from "rxjs";

import type { IRequestApp } from "../../request/interfaces/request.interface";
import { LOGGER_ACTION_META_KEY, LOGGER_OPTIONS_META_KEY } from "../constants/logger.constant";
import type { ENUM_LOGGER_ACTION } from "../constants/logger.enum.constant";
import type { ILoggerOptions } from "../interfaces/logger.interface";

@Injectable()
export class LoggerInterceptor implements NestInterceptor<any> {
  constructor(
    private readonly reflector: Reflector, // private readonly loggerService: LoggerService, // private readonly debuggerService: DebuggerService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    if (context.getType() === "http") {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const { method, originalUrl, user, __id, body, params, path } = ctx.getRequest<IRequestApp>();
      const responseExpress = ctx.getResponse<Response>();
      const requestExpress = ctx.getRequest<Request>();

      return next.handle().pipe(
        tap(async (response: Promise<Record<string, any>>) => {
          const responseData: Record<string, any> = await response;
          const responseStatus: number = responseExpress.statusCode;
          const statusCode = responseData?.statusCode ?? responseStatus;
          const __path = requestExpress.url;

          const loggerAction: ENUM_LOGGER_ACTION = this.reflector.get<ENUM_LOGGER_ACTION>(
            LOGGER_ACTION_META_KEY,
            context.getHandler(),
          );
          const loggerOptions: ILoggerOptions = this.reflector.get<ILoggerOptions>(
            LOGGER_OPTIONS_META_KEY,
            context.getHandler(),
          );

          // await this.loggerService.raw({
          //   level: loggerOptions?.level ?? ENUM_LOGGER_LEVEL.INFO,
          //   action: loggerAction,
          //   description:
          //     loggerOptions?.description ??
          //     `Request ${method} called, url ${originalUrl}, and action ${loggerAction}`,
          //   // apiKey: apiKey?._id,
          //   user: user?._id,
          //   requestId: __id,
          //   method: method as ENUM_REQUEST_METHOD,
          //   role: user?.role,
          //   params,
          //   bodies: body,
          //   path,
          //   statusCode,
          //   tags: loggerOptions?.tags ?? [],
          // });
        }),
      );
    }

    return next.handle();
  }
}
