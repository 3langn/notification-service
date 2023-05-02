import type {
  ENUM_LOGGER_ACTION,
  ENUM_LOGGER_LEVEL,
} from "src/common/logger/constants/logger.enum.constant";
import type { ENUM_REQUEST_METHOD } from "src/common/request/constants/request.enum.constant";

export class LoggerCreateDto {
  action: ENUM_LOGGER_ACTION;

  description: string;

  apiKey?: string;

  user?: string;

  requestId?: string;

  method: ENUM_REQUEST_METHOD;

  path: string;

  role?: string;

  tags?: string[];

  params?: Record<string, any>;

  bodies?: Record<string, any>;

  statusCode?: number;
}

export class LoggerCreateRawDto extends LoggerCreateDto {
  level: ENUM_LOGGER_LEVEL;
}
