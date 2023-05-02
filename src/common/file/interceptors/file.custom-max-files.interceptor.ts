import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Reflector } from "@nestjs/core";
import type { Observable } from "rxjs";
import { FILE_CUSTOM_MAX_FILES_META_KEY } from "src/common/file/constants/file.constant";

@Injectable()
export class FileCustomMaxFilesInterceptor implements NestInterceptor<any> {
  constructor(private readonly reflector: Reflector) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<void>> {
    if (context.getType() === "http") {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const request = ctx.getRequest();

      const maxFiles: number = this.reflector.get<number>(
        FILE_CUSTOM_MAX_FILES_META_KEY,
        context.getHandler(),
      );
      request.__customMaxFiles = maxFiles;

      return next.handle();
    }

    return next.handle();
  }
}
