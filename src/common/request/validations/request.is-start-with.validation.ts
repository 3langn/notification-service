import { Injectable } from "@nestjs/common";
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from "class-validator";
import { registerDecorator, ValidatorConstraint } from "class-validator";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsStartWithConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const [prefix] = args.constraints;
    const check = prefix.find((val: string) => value.startsWith(val));
    return check ?? false;
  }
}

export function IsStartWith(prefix: string[], validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: "IsStartWith",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [prefix],
      validator: IsStartWithConstraint,
    });
  };
}
