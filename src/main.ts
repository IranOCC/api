import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionsFilter } from './utils/exception';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { loggerMiddleware, } from './utils/middleware/logger/logger.middleware';
import { useContainer } from 'class-validator';
import { ContextInterceptor } from './utils/helper/context.interceptor';

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
    // .addGlobalParameters(
    //   { name: "lang", in: "query" },
    //   { name: "x-client-lang", in: "header" },
    // )
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
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    skipUndefinedProperties: true,
    stopAtFirstError: true,
    transform: true,
    forbidUnknownValues: false,
  }
  ));
  // app.useGlobalFilters(new ExceptionsFilter());


  // add app module classValidator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalInterceptors(new ContextInterceptor());

  // run app
  await app.listen(8000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);

  // await CommandFactory.run(SayHelloModule);

}
bootstrap();
