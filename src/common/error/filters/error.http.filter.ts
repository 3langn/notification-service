import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Catch, HttpException, HttpStatus } from "@nestjs/common";
import type { HttpArgumentsHost } from "@nestjs/common/interfaces";
import type { Response } from "express";
import { DatabaseDefaultUUID } from "src/common/database/constants/database.function.constant";
import { DebuggerService } from "src/common/debugger/services/debugger.service";
import type {
  IErrorException,
  IErrors,
  IErrorsImport,
} from "src/common/error/interfaces/error.interface";
import type { ErrorMetadataSerialization } from "src/common/error/serializations/error.serialization";
import { HelperDateService } from "src/common/helper/services/helper.date.service";
import type { IRequestApp } from "src/common/request/interfaces/request.interface";

import { ApiConfigService } from "../../../shared/services/api-config.service";

// If we throw error with HttpException, there will always return object
// The exception filter only catch HttpException
@Catch()
export class ErrorHttpFilter implements ExceptionFilter {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly configService: ApiConfigService,
    // private readonly messageService: MessageService,
    private readonly helperDateService: HelperDateService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: IRequestApp = ctx.getRequest<IRequestApp>();

    // get request headers
    const __customLang: string[] = request.__customLang ?? [
      this.configService.appConfig.appLanguage,
    ];
    const __class = request.__class ?? ErrorHttpFilter.name;
    const __function = request.__function ?? this.catch.name;
    const __requestId = request.__id ?? DatabaseDefaultUUID();
    const __path = request.path;
    const __timestamp =
      request.__xTimestamp ?? request.__timestamp ?? this.helperDateService.timestamp();
    const __timezone = request.__timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    const __version = request.__version ?? this.configService.appConfig.version;

    // Debugger
    try {
      this.debuggerService.error(
        request?.__id ? request.__id : ErrorHttpFilter.name,
        {
          description: exception instanceof Error ? exception.message : exception.toString(),
          class: __class ?? ErrorHttpFilter.name,
          function: __function ?? this.catch.name,
          path: __path,
        },
        exception,
      );
    } catch (err: unknown) {
      console.log("ErrorHttpFilter.catch", err);
    }

    // set default
    let statusHttp: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let messagePath = `http.${statusHttp}`;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let _error: string;
    let errors: IErrors[] | IErrorsImport[];
    // let messageProperties: IMessageOptionsProperties;
    let data: Record<string, any>;
    let metadata: ErrorMetadataSerialization = {
      languages: __customLang,
      timestamp: __timestamp,
      timezone: __timezone,
      requestId: __requestId,
      path: __path,
      version: __version,
    };
    if (exception instanceof HttpException) {
      // Restructure
      const responseException = exception.getResponse();
      statusHttp = exception.getStatus();
      messagePath = `http.${statusHttp}`;
      statusCode = exception.getStatus();

      if (this.isErrorException(responseException)) {
        // const { _metadata } = responseException;

        statusCode = responseException.statusCode;
        messagePath = responseException.message;
        data = responseException.data;
        // messageProperties = _metadata?.customProperty?.messageProperties;
        // delete _metadata?.customProperty;

        metadata = {
          ...metadata,
          // ..._metadata,
        };

        if (responseException.errors?.length > 0) {
          // errors = responseException.errors;
          // responseException._errorType === ERROR_TYPE.IMPORT
          //   ? this.messageService.getImportErrorsMessage(
          //       responseException.errors as IValidationErrorImport[],
          //       { customLanguages: __customLang },
          //     )
          //   : this.messageService.getRequestErrorsMessage(
          //       responseException.errors as ValidationError[],
          //       { customLanguages: __customLang },
          //     );
        }

        if (!responseException._error) {
          _error =
            typeof responseException._error !== "string"
              ? JSON.stringify(responseException._error)
              : responseException._error;
        }
      }
    }

    const message: string = messagePath;
    const responseBody = {
      statusCode,
      message,
      errors,
      _error,
      _metadata: metadata,
      data,
    };

    response
      .setHeader("x-custom-lang", __customLang)
      .setHeader("x-timestamp", __timestamp)
      .setHeader("x-timezone", __timezone)
      .setHeader("x-request-id", __requestId)
      .setHeader("x-version", __version)
      .status(statusHttp)
      .json(responseBody);
  }

  isErrorException(obj: any): obj is IErrorException {
    return typeof obj === "object" ? "statusCode" in obj && "message" in obj : false;
  }
}
