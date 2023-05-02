import { Injectable } from "@nestjs/common";

import type { IDatabaseFindAllOptions } from "../../../common/database/interfaces/database.interface";
import type { INotificationService } from "../interfaces/notification.service.interface";
import type { NotificationEntity } from "../notification.entity.ts/notification.entity";
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
