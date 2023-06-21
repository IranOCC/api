import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionsFilter } from './utils/exception';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { loggerMiddleware, } from './utils/middleware/logger/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // prefix
  app.setGlobalPrefix(`api`);

  // cors
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  // swagger options
  const options = new DocumentBuilder()
    .setTitle('iranocc-api')
    .setDescription('The API of iranocc.com')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // implant swagger
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document, { customSiteTitle: "IranOcc Api" });


  // global middleware
  app.use(loggerMiddleware)

  // exception & validation middleware
  app.useGlobalFilters(new I18nValidationExceptionFilter({
    errorFormatter: (errors) => {
      let _errors = {}
      errors.map((obj1) => {
        _errors[`${obj1.property}`] = obj1.constraints
        obj1.children.map((obj2) => {
          _errors[`${obj1.property}.${obj2.property}`] = obj2.constraints
        })
      })
      return _errors
    }
  }));
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, skipUndefinedProperties: true, stopAtFirstError: true, transform: true, forbidUnknownValues: true }));
  // app.useGlobalFilters(new ExceptionsFilter());


  // run app
  await app.listen(8000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
