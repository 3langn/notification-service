import { ApiHideProperty } from "@nestjs/swagger";
import type { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "src/common/pagination/constants/pagination.enum.constant";
import { IPaginationOrder } from "src/common/pagination/interfaces/pagination.interface";

export class PaginationListDto {
  @ApiHideProperty()
  search: Record<string, any>;

  @ApiHideProperty()
  limit: number;

  @ApiHideProperty()
  offset: number;

  @ApiHideProperty()
  orderBy: IPaginationOrder;

  @ApiHideProperty()
  availableOrderBy: string[];

  @ApiHideProperty()
  availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[];
}
