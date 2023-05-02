import { ConsoleLogger } from "@nestjs/common";
import type { Request, Response } from "express";
import type { TokenIndexer } from "morgan";

export const DEBUGGER_NAME = "system";

export const DEBUGGER_HTTP_FORMAT =
  "':remote-addr' - ':remote-user' - '[:date[iso]]' - 'HTTP/:http-version' - '[:status]' - ':method' - ':url' - 'Request Header :: :req-headers' - 'Request Params :: :req-params' - 'Request Body :: :req-body' - 'Response Header :: :res[header]' - 'Response Body :: :res-body' - ':response-time ms' - ':referrer' - ':user-agent'";

export const DEBUGGER_HTTP_NAME = "http";
export const LOGGER_HTTP_CONTEXT = "HttpLogger";

const isProduction = process.env.NODE_ENV === "production";
// const winstonConfig = config.get('winston');

// export const winstonConfig = {
//   format: winston.format.colorize(),
//   exitOnError: false,
//   transports: new winston.transports.Console({
//     format: winston.format.combine(
//       winston.format.timestamp(),
//       winston.format.ms(),
//       winston.format.errors({ stack: true }),
//       nestWinstonModuleUtilities.format.nestLike("Logger", {
//         prettyPrint: true,
//       }),
//     ),
//   }),
// } as WinstonModuleOptions;

export class HttpConsoleLogger extends ConsoleLogger {
  constructor() {
    super(LOGGER_HTTP_CONTEXT);
  }

  protected formatPid(pid: number) {
    return `[App] ${pid}  - `;
  }

  public logHttpFormatCb = (
    tokens: TokenIndexer<Request, Response>,
    req: Request,
    res: Response,
  ): string => {
    const status = Number(tokens.status(req, res));
    const remoteAddr = tokens["remote-addr"](req, res);
    const remoteUser = tokens["remote-user"](req, res);
    const date = tokens.date(req, res, "iso");
    const httpVersion = tokens["http-version"](req, res);
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const reqHeaders = tokens["req-headers"](req, res);
    const reqParams = tokens["req-params"](req, res);
    const reqBody = tokens["req-body"](req, res);
    const resBody = tokens["res-body"](req, res);
    const responseTime = tokens["response-time"](req, res);
    const referrer = tokens.referrer(req, res);
    const userAgent = tokens["user-agent"](req, res);

    const message = `${date} HTTP/${httpVersion} - [${status}] - [${method}] - ${url} - ${remoteAddr} - ${remoteUser} - Request Header :: ${reqHeaders} - Request Params :: ${reqParams} - Request Body :: ${reqBody} - Response Body :: ${resBody} - ${responseTime} ms - ${referrer} - ${userAgent}`;
    const logLevel = status >= 500 ? "error" : status >= 400 ? "warn" : "log";

    const pidMessage = this.formatPid(process.pid);
    const contextMessage = this.formatContext(this.context);
    const timestampDiff = this.updateAndGetTimestampDiff();
    const formattedLogLevel = logLevel.toUpperCase().padStart(7, " ");
    const formattedMessage = this.formatMessage(
      logLevel,
      message,
      pidMessage,
      formattedLogLevel,
      contextMessage,
      timestampDiff,
    );

    return formattedMessage;
  };
}
