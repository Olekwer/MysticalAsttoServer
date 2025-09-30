import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsZodiacSign(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isZodiacSign',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          const validSigns = [
            'ARIES',
            'TAURUS',
            'GEMINI',
            'CANCER',
            'LEO',
            'VIRGO',
            'LIBRA',
            'SCORPIO',
            'SAGITTARIUS',
            'CAPRICORN',
            'AQUARIUS',
            'PISCES',
          ];
          return typeof value === 'string' && validSigns.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} должен быть валидным знаком зодиака`;
        },
      },
    });
  };
}
