import { Controller, Get, Logger } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { PaginationQuery } from "../../../common/pagination/decorators/pagination.decorator";
import { PaginationListDto } from "../../../common/pagination/dtos/pagination.list.dto";
import { ResponsePaging } from "../../../common/response/decorators/response.decorator";
import type { IResponsePaging } from "../../../common/response/interfaces/response.interface";
import { ApiConfigService } from "../../../shared/services/api-config.service";
import { MessageService } from "../../rmq/services/rmq.service";
import {
  NOTIFICATION_DEFAULT_AVAILABLE_ORDER_BY,
  NOTIFICATION_DEFAULT_AVAILABLE_SEARCH,
  NOTIFICATION_DEFAULT_ORDER_BY,
  NOTIFICATION_DEFAULT_ORDER_DIRECTION,
  NOTIFICATION_DEFAULT_PER_PAGE,
} from "../constants/notification.constant";
import { NotificationListDoc } from "../docs/notification.doc";
import { ListNotificationsResponseDto } from "../dtos/notification.dto";
import { NotificationService } from "../services/notification.service";

@ApiTags("notifications")
@Controller("/notifications")
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(
    private readonly configService: ApiConfigService,
    private readonly notificationService: NotificationService,
    private readonly messageService: MessageService,
  ) {}

  @NotificationListDoc()
  @ResponsePaging("notifications.list", {
    serialization: ListNotificationsResponseDto,
  })
  @Get()
  async list(
    @PaginationQuery(
      NOTIFICATION_DEFAULT_PER_PAGE,
      NOTIFICATION_DEFAULT_ORDER_BY,
      NOTIFICATION_DEFAULT_ORDER_DIRECTION,
      NOTIFICATION_DEFAULT_AVAILABLE_SEARCH,
      NOTIFICATION_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { search, limit, offset, orderBy }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const notifications = await this.notificationService.findAll({
      ...search,
      paging: { limit, offset },
      order: orderBy,
    });
    return {
      _pagination: { total: 1, totalPage: 1 },
      data: notifications,
    };
  }
}
