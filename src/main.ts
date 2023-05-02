import {
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import * as compression from "compression";
import rateLimit from "express-rate-limit";

import { AppModule } from "./app.module";
import { ApiConfigService } from "./shared/services/api-config.service";
import { SharedModule } from "./shared/shared.module";
import swaggerInit from "./swagger";

async function bootstrap() {
  const logger = new Logger("Main");

  // initializeTransactionalContext();
  // patchTypeORMRepositoryWithBaseRepository();

  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  const configService = app.select(SharedModule).get(ApiConfigService);

  const _ = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.rabbitmqConfig.uri],
      queue: configService.rabbitmqConfig.queueName,
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();

  // requestMiddlewareModuleConfig(app);
  app.setGlobalPrefix(configService.appConfig.prefix);

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10000,
    }),
  );
  app.use(compression());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const { port, host } = configService.appConfig;
  if (configService.documentationEnabled) {
    await swaggerInit(app);
  }
  await app.listen(port, host);

  logger.log(`==========================================================`);

  logger.log(`Environment: ${process.env.APP_ENV}`);
  logger.log(`Http versioning is ${configService.appConfig.version}`);
  logger.log(`Database uri ${configService.mongoConfig.uri}`);

  logger.log(`Http Server running on ${await app.getUrl()}`);
  logger.log(`==========================================================`);
}
bootstrap();
