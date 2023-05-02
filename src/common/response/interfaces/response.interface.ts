import type { HttpStatus } from "@nestjs/common";
import type { ClassConstructor } from "class-transformer";
import type { ENUM_HELPER_FILE_TYPE } from "src/common/helper/constants/helper.enum.constant";
import type { IHelperFileRows } from "src/common/helper/interfaces/helper.interface";

export interface IResponseCustomPropertyMetadata {
  statusCode?: number;
  message?: string;
  httpStatus?: HttpStatus;
  // messageProperties?: IMessageOptionsProperties;
}

// metadata
export interface IResponseMetadata {
  customProperty?: IResponseCustomPropertyMetadata;
  [key: string]: any;
}

// decorator options

export interface IResponseOptions<T> {
  serialization?: ClassConstructor<T>;
  // messageProperties?: IMessageOptionsProperties;
}

export type IResponsePagingOptions<T> = IResponseOptions<T>;

export interface IResponseExcelOptions<T> extends IResponseOptions<T> {
  fileType?: ENUM_HELPER_FILE_TYPE;
}

// type
export interface IResponse {
  _metadata?: IResponseMetadata;
  data?: Record<string, any>;
}

export interface IResponsePagingPagination {
  totalPage: number;
  total: number;
}

export interface IResponsePaging {
  _metadata?: IResponseMetadata;
  _pagination: IResponsePagingPagination;
  data: Record<string, any>[];
}

export interface IResponseExcel {
  data: IHelperFileRows[];
}
