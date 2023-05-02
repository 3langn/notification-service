import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { MongooseModuleOptions } from "@nestjs/mongoose";
import { isNil } from "lodash";
import mongoose from "mongoose";

import { ENUM_APP_ENVIRONMENT } from "../../app/constants/app.enum.constant";

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.appEnv === "development";
  }

  get isProduction(): boolean {
    return this.appEnv === "production";
  }

  get isTest(): boolean {
    return this.appEnv === "test";
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(`${key} environment variable is not a number`);
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(`${key} env var is not a boolean`);
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value;
  }

  get appEnv(): string {
    return this.getString("APP_ENV");
  }

  get mongoConfig(): MongooseModuleOptions {
    const env = this.configService.get<string>("APP_ENV");
    const host = this.configService.get<string>("MONGO_HOST");
    const database = this.configService.get<string>("MONGO_DATABASE");
    const user = this.configService.get<string>("MONGO_USER");
    const password = this.configService.get<string>("MONGO_PASSWORD");
    const debug = this.configService.get<boolean>("MONGO_DEBUG");

    const options = this.configService.get<string>("MONGO_OPTIONS")
      ? `?${this.configService.get<string>("MONGO_OPTIONS")}`
      : "";

    let uri = `${host}`;

    if (database) {
      uri = `${uri}/${database}${options}`;
    }

    if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
      mongoose.set("debug", debug);
    }

    const mongooseOptions: MongooseModuleOptions = {
      uri,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      autoCreate: true,
      // useMongoClient: true,
    };

    if (user && password) {
      mongooseOptions.auth = {
        username: user,
        password,
      };
    }

    return mongooseOptions;
  }

  get rabbitmqConfig() {
    return {
      uri: this.getString("RABBITMQ_URI"),
      queueName: this.getString("RABBITMQ_QUEUE"),
    };
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString("AWS_S3_BUCKET_REGION"),
      bucketApiVersion: this.getString("AWS_S3_API_VERSION"),
      bucketName: this.getString("AWS_S3_BUCKET_NAME"),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean("ENABLE_DOCUMENTATION");
  }

  get appConfig() {
    return {
      port: this.getString("HTTP_PORT"),
      debug: this.getBoolean("APP_DEBUG"),
      env: this.getString("APP_ENV"),
      name: this.getString("APP_NAME"),
      version: this.getString("HTTP_VERSION"),
      host: this.getString("HTTP_HOST"),
      prefix: this.getString("HTTP_PREFIX"),
      appLanguage: this.getString("APP_LANGUAGE"),
    };
  }

  get docsConfig() {
    return {
      docsName: this.getString("DOCS_NAME"),
      docsDescription: this.getString("DOCS_DESCRIPTION"),
      docsVersion: this.getString("DOCS_VERSION"),
      docsPrefix: this.getString("DOCS_PREFIX"),
    };
  }

  get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(`${key} environment variable does not set`); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  getRaw<T>(key?: string): T {
    return this.configService.get<T>(key);
  }
}
