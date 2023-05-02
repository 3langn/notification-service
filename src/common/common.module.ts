import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import * as Joi from "joi";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import * as path from "path";
import { APP_LANGUAGE } from "src/app/constants/app.constant";
import { ENUM_APP_ENVIRONMENT } from "src/app/constants/app.enum.constant";
import { ErrorModule } from "src/common/error/error.module";
import { HelperModule } from "src/common/helper/helper.module";
import { PaginationModule } from "src/common/pagination/pagination.module";
import { RequestModule } from "src/common/request/request.module";
import { ResponseModule } from "src/common/response/response.module";

import { ApiConfigService } from "../shared/services/api-config.service";
import { SharedModule } from "../shared/shared.module";
import { DATABASE_CONNECTION_NAME } from "./database/constants/database.constant";
import { DebuggerModule } from "./debugger/debugger.module";
// import configs from "src/configs";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.env.development`,
      expandVariables: true,
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        APP_ENV: Joi.string()
          .valid(...Object.values(ENUM_APP_ENVIRONMENT))
          .default("development")
          .required(),
        APP_LANGUAGE: Joi.string()
          // .valid(...Object.values(ENUM_MESSAGE_LANGUAGE))
          .default(APP_LANGUAGE)
          .required(),

        HTTP_HOST: [
          Joi.string().ip({ version: "ipv4" }).required(),
          Joi.valid("localhost").required(),
        ],
        HTTP_PORT: Joi.number().default(3000).required(),
        HTTP_VERSIONING_ENABLE: Joi.boolean().default(true).required(),
        HTTP_VERSION: Joi.string().required(),

        MONGO_HOST: Joi.string().default("mongodb://localhost:27017").required(),
        MONGO_DATABASE: Joi.string().default("ack").required(),
        MONGO_USER: Joi.string().allow(null, "").optional(),
        MONGO_PASSWORD: Joi.string().allow(null, "").optional(),
        MONGO_DEBUG: Joi.boolean().default(false).required(),
        MONGO_OPTIONS: Joi.string().allow(null, "").optional(),

        AWS_CREDENTIAL_KEY: Joi.string().allow(null, "").optional(),
        AWS_CREDENTIAL_SECRET: Joi.string().allow(null, "").optional(),
        AWS_S3_REGION: Joi.string().allow(null, "").optional(),
        AWS_S3_BUCKET: Joi.string().allow(null, "").optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "../i18n/"),
        watch: true,
      },
      typesOutputPath: path.join(__dirname, "../i18n/i18n.generated.ts"),
      resolvers: [{ use: QueryResolver, options: ["lang"] }, AcceptLanguageResolver],
    }),
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME,
      imports: [SharedModule],
      useFactory: async (apiConfigService: ApiConfigService) => {
        return apiConfigService.mongoConfig;
      },
      inject: [ApiConfigService],
    }),
    DebuggerModule.forRoot(),
    HelperModule,
    PaginationModule,
    ErrorModule,
    ResponseModule,
    RequestModule,
  ],
})
export class CommonModule {}
