import { Injectable } from "@nestjs/common";

import type { IDatabaseFindAllOptions } from "../../../common/database/interfaces/database.interface";
import type { NotificationEntity } from "../entity/notification.entity";
import type { INotificationService } from "../interfaces/notification.service.interface";
import { NotificationRepository } from "../repositories/notification.repository";

@Injectable()
export class NotificationService implements INotificationService {
  constructor(private readonly roleRepository: NotificationRepository) {}

  findOne(find: Record<string, any>): Promise<NotificationEntity> {
    return this.roleRepository.findOne(find);
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<NotificationEntity[]> {
    return this.roleRepository.findAll<NotificationEntity>(find, options);
  }
}
