import { faker } from "@faker-js/faker";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { CommonModule } from "../../../src/common/common.module";
import { ENUM_NOTIFICATION_CHANNEL } from "../../../src/modules/notification/constants/notification.channel.constant";
import {
  ENUM_NOTIFICATION_STATUS,
  ENUM_NOTIFICATION_TYPE,
} from "../../../src/modules/notification/constants/notification.constant";
import type { PlaceOrderNotificationPayloadDto } from "../../../src/modules/notification/dtos/notification.dto";
import { NotificationModule } from "../../../src/modules/notification/notification.module";
import { NotificationRepository } from "../../../src/modules/notification/repositories/notification.repository";
import {
  ENUM_QUEUE,
  ENUM_ROUTING_KEY,
  MapQueueWithExchange,
} from "../../../src/modules/rmq/constants/rmq.constants";
import { MessageModule } from "../../../src/modules/rmq/rmq.module";

describe("Notification", () => {
  let app: INestApplication;
  let amqpConnection: AmqpConnection;
  let notificationRepository: NotificationRepository;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              // this is being super extra, in the case that you need multiple keys with the `get` method
              if (key === "FOO") {
                return 123;
              }
              return null;
            }),
          },
        },
      ],
      imports: [MessageModule, CommonModule, NotificationModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    amqpConnection = app.get<AmqpConnection>(AmqpConnection);
    notificationRepository = app.get<NotificationRepository>(NotificationRepository);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should place order notification", async () => {
    const order_id = faker.datatype.uuid();
    const payload: PlaceOrderNotificationPayloadDto = {
      data: {
        order_id,
      },
      title: "Place order",
      channel: ENUM_NOTIFICATION_CHANNEL.EMAIL,
      recipient_id: faker.datatype.uuid(),
      sender_id: faker.datatype.uuid(),
      template_id: "place-order",
      type: ENUM_NOTIFICATION_TYPE.PLACE_ORDER,
      status: ENUM_NOTIFICATION_STATUS.PENDING,
    };

    await amqpConnection.publish(
      MapQueueWithExchange[ENUM_QUEUE.NOTIFICATION],
      ENUM_ROUTING_KEY.PLACE_ORDER,
      payload,
    );

    const notification = await notificationRepository.findOne({
      data: {
        order_id,
      },
    });

    expect(notification).toBeTruthy();
  });
});
