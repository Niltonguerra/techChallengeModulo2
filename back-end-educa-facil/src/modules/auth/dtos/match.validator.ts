import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'Match', async: false })
export class Match implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as string[];

    const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];

    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as string[];
    return `${args.property} deve ser igual a ${relatedPropertyName}`;
  }
}
