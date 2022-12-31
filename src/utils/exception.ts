import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // console.log(exception);

    let statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let type = exception.name;
    let message = exception.message;
    let detail: object | string;

    switch (exception.name) {
      case 'UnauthorizedException': {
        statusCode = HttpStatus.UNAUTHORIZED;
        message =
          exception['message'] || 'You need to login to perform this action';
        break;
      }
      case 'ForbiddenException': {
        statusCode = HttpStatus.FORBIDDEN;
        message = exception['message'] || "You don't have access";
        break;
      }
      case 'BadRequestException': {
        statusCode = HttpStatus.BAD_REQUEST;
        message = exception['response']['message'];
        detail = exception['response']['errors'];
        break;
      }
      case 'I18nValidationException': {
        statusCode = HttpStatus.BAD_REQUEST;
        message = exception['message'];
        detail = exception['errors'];
        break;
      }
      case 'DocumentNotFoundError': {
        statusCode = HttpStatus.NOT_FOUND;
        message = exception['message'] || 'Not Found';
        break;
      }
      case 'ValidationError': {
        statusCode = HttpStatus.NOT_ACCEPTABLE;
        detail = exception['errors'];
        break;
      }
      case 'MongoServerError': {
        statusCode = HttpStatus.NOT_ACCEPTABLE;
        switch (exception['code']) {
          case 11000:
            type = 'DuplicateError';
            const keys = Object.keys(exception['keyValue']);
            const field = keys[0];
            // const value = exception['keyValue'][field];
            message = `The field "${field}" exists`;
            detail = {
              fields: [field],
            };
            break;
        }
        break;
      }

      // case 'MongooseError': { break; }
      // case 'CastError': { break; }
      // case 'DisconnectedError': { break; }
      // case 'DivergentArrayError': { break; }
      // case 'MissingSchemaError': { break; }
      // case 'ValidatorError': { break; }
      // case 'ObjectExpectedError': { break; }
      // case 'ObjectParameterError': { break; }
      // case 'OverwriteModelError': { break; }
      // case 'ParallelSaveError': { break; }
      // case 'StrictModeError': { break; }
      // case 'VersionError': { break; }
    }

    response.status(statusCode).json({
      statusCode,
      type,
      message,
      detail,
    });
  }
}
