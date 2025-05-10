import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Episode extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: false })
  isExclusive: boolean;

  @Prop({ required: true, default: 0 })
  likesNumber: number;

  @Prop({ required: true, default: false })
  reviewed: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode); 