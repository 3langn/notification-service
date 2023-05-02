import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { HttpConsoleLogger } from "src/common/debugger/constants/debugger.constant";
import type { IDebuggerHttpMiddleware } from "src/common/debugger/interfaces/debugger.interface";

@Injectable()
export class DebuggerHttpMiddleware implements NestMiddleware {
  private readonly writeIntoFile: boolean;

  private readonly writeIntoConsole: boolean;

  constructor(private readonly configService: ConfigService) {
    this.writeIntoFile = this.configService.get<boolean>("debugger.http.writeIntoFile");
    this.writeIntoConsole = this.configService.get<boolean>("debugger.http.writeIntoConsole");
  }

  private customToken(): void {
    morgan.token("req-params", (req: Request) => JSON.stringify(req.params));

    morgan.token("req-body", (req: Request) => JSON.stringify(req.body));

    morgan.token("res-body", (req: Request, res: IDebuggerHttpMiddleware) => res.body);

    morgan.token("req-headers", (req: Request) => JSON.stringify(req.headers));
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (this.writeIntoConsole || this.writeIntoFile) {
      this.customToken();
    }

    next();
  }
}

@Injectable()
export class DebuggerHttpWriteIntoConsoleMiddleware implements NestMiddleware {
  private readonly writeIntoConsole: boolean;

  private readonly httpConsoleLogger: HttpConsoleLogger = new HttpConsoleLogger();

  constructor(private readonly configService: ConfigService) {
    this.writeIntoConsole = this.configService.get<boolean>("debugger.http.writeIntoConsole");
  }

  // private async httpLogger(): Promise<IDebuggerHttpConfig> {
  //     return {
  //         debuggerHttpFormat: ,
  //     };
  // }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (this.writeIntoConsole) {
      morgan(this.httpConsoleLogger.logHttpFormatCb)(req, res, next);
    } else {
      next();
    }
  }
}

@Injectable()
export class DebuggerHttpResponseMiddleware implements NestMiddleware {
  private readonly writeIntoFile: boolean;

  private readonly writeIntoConsole: boolean;

  constructor(private readonly configService: ConfigService) {
    this.writeIntoConsole = this.configService.get<boolean>("debugger.http.writeIntoConsole");
    this.writeIntoFile = this.configService.get<boolean>("debugger.http.writeIntoFile");
  }

  use(req: Request, res: Response, next: NextFunction): void {
    if (this.writeIntoConsole || this.writeIntoFile) {
      const { send } = res;
      const resOld: any = res;

      // Add response data to request
      // this is for morgan
      resOld.send = (body: any) => {
        resOld.body = body;
        resOld.send = send;
        resOld.send(body);

        res = resOld as Response;
      };
    }

    next();
  }
}
