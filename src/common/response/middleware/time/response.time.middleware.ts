import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import * as responseTime from "response-time";

@Injectable()
export class ResponseTimeMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    responseTime()(req, res, next);
  }
}
