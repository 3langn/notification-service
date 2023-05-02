import type { INestApplication } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ENUM_APP_ENVIRONMENT } from "src/app/constants/app.enum.constant";
import { ResponseDefaultSerialization } from "src/common/response/serializations/response.default.serialization";
import { ResponsePagingSerialization } from "src/common/response/serializations/response.paging.serialization";

import { ApiConfigService } from "./shared/services/api-config.service";
import { SharedModule } from "./shared/shared.module";

export default async function swaggerInit(app: INestApplication) {
  const configService = app.select(SharedModule).get(ApiConfigService);

  const { env } = configService.appConfig;
  const logger = new Logger();

  const docName: string = configService.docsConfig.docsName;
  const docDesc: string = configService.docsConfig.docsDescription;
  const docVersion: string = configService.docsConfig.docsVersion;
  const docPrefix: string = configService.docsConfig.docsPrefix;
  const { host } = configService.appConfig;

  if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
    const documentBuild = new DocumentBuilder()
      .setTitle(docName)
      .setDescription(docDesc)
      .setVersion(docVersion)
      .addTag("API's")
      .addServer(`/`)
      .addServer(`/staging`)
      .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "accessToken")
      .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "refreshToken")
      .addApiKey({ type: "apiKey", in: "header", name: "x-api-key" }, "apiKey")
      .build();

    const document = SwaggerModule.createDocument(app, documentBuild, {
      deepScanRoutes: true,
      extraModels: [ResponseDefaultSerialization, ResponsePagingSerialization],
    });

    SwaggerModule.setup(docPrefix, app, document, {
      explorer: true,
      customSiteTitle: docName,
    });

    logger.log(`==========================================================`);

    logger.log(
      `Docs will serve on http://${configService.appConfig.host}:${configService.appConfig.port}${docPrefix}`,
    );

    logger.log(`==========================================================`);
  }
}
