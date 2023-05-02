import { Injectable } from "@nestjs/common";
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from "class-validator";
import { registerDecorator, ValidatorConstraint } from "class-validator";

@ValidatorConstraint({ async: true })
@Injectable()
export class MobileNumberAllowedConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  // constructor(private readonly settingService: SettingService) {}
  // async validate(value: string): Promise<boolean> {
  //   const mobileNumbersSetting: string[] =
  //     await this.settingService.getMobileNumberCountryCodeAllowed();
  //   mobileNumbersSetting;
  //   const check = mobileNumbersSetting.find((val) => value.startsWith(val));
  //   return !!check;
  // }
}

export function MobileNumberAllowed(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: "MobileNumberAllowed",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: MobileNumberAllowedConstraint,
    });
  };
}
