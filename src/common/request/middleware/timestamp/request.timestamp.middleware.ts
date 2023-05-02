import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { NextFunction, Response } from "express";
import { HelperDateService } from "src/common/helper/services/helper.date.service";
import { HelperNumberService } from "src/common/helper/services/helper.number.service";
import type { IRequestApp } from "src/common/request/interfaces/request.interface";

@Injectable()
export class RequestTimestampMiddleware implements NestMiddleware {
  constructor(
    private readonly helperNumberService: HelperNumberService,
    private readonly helperDateService: HelperDateService,
  ) {}

  async use(req: IRequestApp, res: Response, next: NextFunction): Promise<void> {
    req.__xTimestamp = req["x-timestamp"]
      ? this.helperNumberService.create(req["x-timestamp"])
      : undefined;
    req.__timestamp = this.helperDateService.timestamp();
    next();
  }
}
