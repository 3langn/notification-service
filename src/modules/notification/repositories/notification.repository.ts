import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { DatabaseMongoUUIDRepositoryAbstract } from "src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract";
import { DatabaseModel } from "src/common/database/decorators/database.decorator";

import type { NotificationDocument } from "../entity/notification.entity";
import { NotificationEntity } from "../entity/notification.entity";

@Injectable()
export class NotificationRepository extends DatabaseMongoUUIDRepositoryAbstract<
  NotificationEntity,
  NotificationDocument
> {
  constructor(
    @DatabaseModel(NotificationEntity.name)
    private readonly notificationModel: Model<NotificationEntity>,
  ) {
    super(notificationModel);
  }
}
