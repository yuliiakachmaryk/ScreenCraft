import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentItemService } from './services/content-item.service';
import { ContentItemController } from './controllers/content-item.controller';
import { ContentItem, ContentItemSchema } from './schemas/content-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContentItem.name, schema: ContentItemSchema },
    ]),
  ],
  controllers: [ContentItemController],
  providers: [ContentItemService],
  exports: [ContentItemService],
})
export class ContentItemModule {} 