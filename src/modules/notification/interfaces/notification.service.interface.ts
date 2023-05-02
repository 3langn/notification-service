import type { IDatabaseFindAllOptions } from "../../../common/database/interfaces/database.interface";
import type { NotificationEntity } from "../notification.entity.ts/notification.entity";

export interface INotificationService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<NotificationEntity[]>;

  findOne(find: Record<string, any>): Promise<NotificationEntity>;
}
