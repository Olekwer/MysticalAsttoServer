import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsElement(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isElement',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const validElements = ['FIRE', 'EARTH', 'AIR', 'WATER'];
          return typeof value === 'string' && validElements.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} должен быть валидным элементом (FIRE, EARTH, AIR, WATER)`;
        },
      },
    });
  };
} 