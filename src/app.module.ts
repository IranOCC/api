import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MinioClientModule } from './minio-client/minio-client.module';
import { ImageUploadModule } from './image-upload/image-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MinioClientModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ImageUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
