import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Injectable, RequestTimeoutException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import ms from "ms";
import type { Observable } from "rxjs";
import { throwError, TimeoutError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";
import { ENUM_ERROR_STATUS_CODE_ERROR } from "src/common/error/constants/error.status-code.constant";
import {
  REQUEST_CUSTOM_TIMEOUT_META_KEY,
  REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
} from "src/common/request/constants/request.constant";

import { ApiConfigService } from "../../../shared/services/api-config.service";

@Injectable()
export class RequestTimeoutInterceptor implements NestInterceptor<Promise<any>> {
  private readonly maxTimeoutInSecond: number;

  constructor(
    private readonly configService: ApiConfigService,
    private readonly reflector: Reflector,
  ) {
    this.maxTimeoutInSecond = this.configService.getRaw<number>("REQUEST_TIMEOUT");
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    if (context.getType() === "http") {
      const customTimeout = this.reflector.get<boolean>(
        REQUEST_CUSTOM_TIMEOUT_META_KEY,
        context.getHandler(),
      );

      if (customTimeout) {
        const seconds: string = this.reflector.get<string>(
          REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
          context.getHandler(),
        );

        return next.handle().pipe(
          timeout(ms(seconds)),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              throw new RequestTimeoutException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_REQUEST_TIMEOUT,
                message: "http.clientError.requestTimeOut",
              });
            }
            return throwError(() => err);
          }),
        );
      }

      return next.handle().pipe(
        timeout(Number(this.maxTimeoutInSecond)),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            throw new RequestTimeoutException({
              statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_REQUEST_TIMEOUT,
              message: "http.clientError.requestTimeOut",
            });
          }
          return throwError(() => err);
        }),
      );
    }

    return next.handle();
  }
}
