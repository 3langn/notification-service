import type { CallHandler, ExecutionContext, HttpStatus, NestInterceptor } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Reflector } from "@nestjs/core";
import type { ClassConstructor, ClassTransformOptions } from "class-transformer";
import { plainToInstance } from "class-transformer";
import type { Response } from "express";
import qs from "qs";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HelperArrayService } from "src/common/helper/services/helper.array.service";
import type { IRequestApp } from "src/common/request/interfaces/request.interface";
import {
  RESPONSE_MESSAGE_PATH_META_KEY,
  RESPONSE_SERIALIZATION_META_KEY,
  RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from "src/common/response/constants/response.constant";
import type { IResponsePaging } from "src/common/response/interfaces/response.interface";
import type {
  ResponsePaginationCursorSerialization,
  ResponsePagingMetadataSerialization,
  ResponsePagingSerialization,
} from "src/common/response/serializations/response.paging.serialization";

import { MessageService } from "../../../modules/rmq/services/rmq.service";

@Injectable()
export class ResponsePagingInterceptor<T> implements NestInterceptor<Promise<T>> {
  constructor(
    private readonly reflector: Reflector,
    private readonly messageService: MessageService,
    private readonly helperArrayService: HelperArrayService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<ResponsePagingSerialization>>> {
    if (context.getType() === "http") {
      return next.handle().pipe(
        map(async (res: Promise<IResponsePaging>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const response: Response = ctx.getResponse();
          const request: IRequestApp = ctx.getRequest<IRequestApp>();

          let messagePath: string = this.reflector.get<string>(
            RESPONSE_MESSAGE_PATH_META_KEY,
            context.getHandler(),
          );
          const classSerialization: ClassConstructor<any> = this.reflector.get<
            ClassConstructor<any>
          >(RESPONSE_SERIALIZATION_META_KEY, context.getHandler());
          const classSerializationOptions: ClassTransformOptions =
            this.reflector.get<ClassTransformOptions>(
              RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
              context.getHandler(),
            );
          // const messageProperties: IMessageOptionsProperties =
          //   this.reflector.get<IMessageOptionsProperties>(
          //     RESPONSE_MESSAGE_PROPERTIES_META_KEY,
          //     context.getHandler(),
          //   );

          // metadata
          const { __customLang } = request;
          const __path = request.path;
          const __requestId = request.__id;
          const __timestamp = request.__xTimestamp ?? request.__timestamp;
          const { __timezone } = request;
          const { __version } = request;
          const { __repoVersion } = request;
          const { __pagination } = request;

          let httpStatus: HttpStatus = response.statusCode;
          let { statusCode } = response;
          let data: Record<string, any>[] = [];
          let metadata: ResponsePagingMetadataSerialization = {
            languages: __customLang,
            timestamp: __timestamp,
            timezone: __timezone,
            requestId: __requestId,
            path: __path,
            version: __version,
            repoVersion: __repoVersion,
          };

          // response
          const responseData = (await res) as IResponsePaging;
          if (!responseData) {
            throw new Error("Paging must have response");
          }

          const { _metadata } = responseData;
          data = responseData.data;

          if (classSerialization) {
            data = plainToInstance(classSerialization, data, classSerializationOptions);
          }

          httpStatus = _metadata?.customProperty?.httpStatus ?? httpStatus;
          statusCode = _metadata?.customProperty?.statusCode ?? statusCode;
          messagePath = _metadata?.customProperty?.message ?? messagePath;

          delete _metadata?.customProperty;

          // metadata pagination

          const { query } = request;

          delete query.perPage;

          delete query.page;

          const { total } = responseData._pagination;

          const { totalPage } = responseData._pagination;

          const { perPage } = __pagination;
          const { page } = __pagination;

          const queryString = qs.stringify(query, {
            encode: false,
          });

          const cursorPaginationMetadata: ResponsePaginationCursorSerialization = {
            nextPage:
              page < totalPage
                ? `${__path}?perPage=${perPage}&page=${page + 1}&${queryString}`
                : undefined,
            previousPage:
              page > 1 ? `${__path}?perPage=${perPage}&page=${page - 1}&${queryString}` : undefined,
            firstPage:
              totalPage > 1 ? `${__path}?perPage=${perPage}&page=${1}&${queryString}` : undefined,
            lastPage:
              totalPage > 1
                ? `${__path}?perPage=${perPage}&page=${totalPage}&${queryString}`
                : undefined,
          };

          metadata = {
            ...metadata,
            ..._metadata,
            pagination: {
              ...__pagination,
              ...metadata._pagination,
              total,
              totalPage,
            },
          };

          if (
            !this.helperArrayService.includes(Object.values(cursorPaginationMetadata), undefined)
          ) {
            metadata.cursor = cursorPaginationMetadata;
          }

          const message: string = messagePath;

          response.status(httpStatus);

          return {
            statusCode,
            message,
            _metadata: metadata,
            data,
          };
        }),
      );
    }

    return next.handle();
  }
}
