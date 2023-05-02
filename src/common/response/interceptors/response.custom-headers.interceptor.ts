import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { HttpArgumentsHost } from "@nestjs/common/interfaces";
import type { Response } from "express";
import type { Observable } from "rxjs";
import type { IRequestApp } from "src/common/request/interfaces/request.interface";

import { APP_LANGUAGE } from "../../../app/constants/app.constant";

// only for response success and error in controller
@Injectable()
export class ResponseCustomHeadersInterceptor implements NestInterceptor<Promise<any>> {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    if (context.getType() === "http") {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const responseExpress: Response = ctx.getResponse();
      const request: IRequestApp = ctx.getRequest();

      responseExpress.setHeader("x-custom-lang", request.__xCustomLang ?? APP_LANGUAGE);
      responseExpress.setHeader("x-timestamp", request.__xTimestamp ?? request.__timestamp);
      responseExpress.setHeader("x-timezone", request.__timezone);
      responseExpress.setHeader("x-request-id", request.__id);
      responseExpress.setHeader("x-version", request.__version);

      return next.handle();
    }

    return next.handle();
  }
}
