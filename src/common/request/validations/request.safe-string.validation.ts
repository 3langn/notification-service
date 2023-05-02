import { Injectable } from "@nestjs/common";
import type { ValidationOptions, ValidatorConstraintInterface } from "class-validator";
import { registerDecorator, ValidatorConstraint } from "class-validator";
import { HelperStringService } from "src/common/helper/services/helper.string.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class SafeStringConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly helperStringService: HelperStringService) {}

  validate(value: string): boolean {
    return value ? this.helperStringService.checkSafeString(value) : false;
  }
}

export function SafeString(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: "SafeString",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: SafeStringConstraint,
    });
  };
}
