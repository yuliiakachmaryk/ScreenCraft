import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class HomeScreenConfig extends Document {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'ContentItem' }] })
  recomendaciones: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ContentItem' }] })
  topCharts: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ContentItem' }] })
  mostTrending: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ContentItem' }] })
  mostPopular: Types.ObjectId[];

  @Prop({ required: true, default: false })
  isActive: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const HomeScreenConfigSchema = SchemaFactory.createForClass(HomeScreenConfig); 
