import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { NextFunction, Response } from "express";
import type { IRequestApp } from "src/common/request/interfaces/request.interface";

@Injectable()
export class RequestTimezoneMiddleware implements NestMiddleware {
  async use(req: IRequestApp, res: Response, next: NextFunction): Promise<void> {
    req.__timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    next();
  }
}
