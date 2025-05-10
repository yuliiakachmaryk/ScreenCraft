import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeScreenModule } from './home-screen/home-screen.module';
import { ContentItemModule } from './content-item/content-item.module';
import { EpisodeModule } from './episode/episode.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/screencraft'),
    HomeScreenModule,
    ContentItemModule,
    EpisodeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
