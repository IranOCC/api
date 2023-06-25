import { Injectable, Type } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Connection } from 'mongoose';






export const IsUnique = <TModel extends Object>(ModelClass: Type<TModel>, path: string, options?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        return registerDecorator({
            name: `IsUnique`,
            target: object.constructor,
            propertyName,
            options,
            constraints: [ModelClass, path],
            validator: IsUniqueProvider,
        });
    }
}

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueProvider implements ValidatorConstraintInterface {
    constructor(@InjectConnection() private readonly connection: Connection) { }
    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const result = await this.connection.models[args.constraints[0].name].count({ [args.constraints[1]]: value });
        return !result
    }

    defaultMessage(args?: ValidationArguments): string {
        return `${args.property} is exists in ${args.constraints[0].name} document`;
    }
}