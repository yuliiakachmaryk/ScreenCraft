import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeScreenService } from './services/home-screen.service';
import { HomeScreenController } from './controllers/home-screen.controller';
import { HomeScreenConfig, HomeScreenConfigSchema } from './schemas/home-screen.schema';
import { ContentItemModule } from '../content-item/content-item.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HomeScreenConfig.name, schema: HomeScreenConfigSchema },
    ]),
    ContentItemModule,
  ],
  controllers: [HomeScreenController],
  providers: [HomeScreenService],
  exports: [HomeScreenService],
})
export class HomeScreenModule {} 