import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Episode } from '../../episode/schemas/episode.schema';

@Schema()
export class ContentItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  introImage: string;

  @Prop({ required: true, default: false })
  isExclusive: boolean;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Episode' }] })
  episodes: Types.ObjectId[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ContentItemSchema = SchemaFactory.createForClass(ContentItem); 