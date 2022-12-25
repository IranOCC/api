import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const VERSION = 'v1';
const VERSION_NUMBER = '1.0';
const DOCUMENT_TITLE = 'iranocc-api';
const DOCUMENT_DESCRIPTION = 'The API of iranocc.com';
const DOCUMENT_PATH = 'api/v1/doc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api/${VERSION}`);
  const options = new DocumentBuilder()
    .setTitle(DOCUMENT_TITLE)
    .setDescription(DOCUMENT_DESCRIPTION)
    .setVersion(VERSION_NUMBER)
    .addTag('iranocc')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(DOCUMENT_PATH, app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
