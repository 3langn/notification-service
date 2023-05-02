import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { NextFunction, Response } from "express";
import type { IRequestApp } from "src/common/request/interfaces/request.interface";

import { ApiConfigService } from "../../../../shared/services/api-config.service";

@Injectable()
export class RequestVersionMiddleware implements NestMiddleware {
  private readonly versioningEnable: boolean;

  private readonly versioningGlobalPrefix: string;

  private readonly versioningPrefix: string;

  private readonly versioningVersion: string;

  constructor(private readonly configService: ApiConfigService) {
    this.versioningGlobalPrefix = this.configService.appConfig.prefix;
    this.versioningEnable = this.configService.appConfig.version !== undefined;
    this.versioningVersion = this.configService.appConfig.version;
  }

  async use(req: IRequestApp, res: Response, next: NextFunction): Promise<void> {
    const { originalUrl } = req;
    let version = this.versioningVersion;
    if (this.versioningEnable && originalUrl.startsWith(`${this.versioningGlobalPrefix}}`)) {
      const url: string[] = originalUrl.split("/");
      version = url[2].replace(this.versioningPrefix, "");
    }

    req.__version = version;

    next();
  }
}
