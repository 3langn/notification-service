import type { Request } from "express";
import type { RequestPaginationSerialization } from "src/common/request/serializations/request.pagination.serialization";

export interface IRequestApp extends Request {
  user?: Record<string, any>;

  __id: string;
  __xTimestamp?: number;
  __timestamp: number;
  __timezone: string;
  __customLang: string[];
  __xCustomLang: string;
  __version: string;
  __repoVersion: string;

  __class?: string;
  __function?: string;

  __filters?: Record<string, string | number | boolean | Array<string | number | boolean>>;
  __pagination?: RequestPaginationSerialization;
}
