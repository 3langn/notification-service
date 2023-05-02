import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { NextFunction, Response } from "express";
import type { IRequestApp } from "src/common/request/interfaces/request.interface";

@Injectable()
export class RequestUserAgentMiddleware implements NestMiddleware {
  async use(req: IRequestApp, res: Response, next: NextFunction): Promise<void> {
    // const parserUserAgent = new UAParser(req["User-Agent"]);
    // const userAgent: IResult = parserUserAgent.getResult();

    next();
  }
}
