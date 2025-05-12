import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Section {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  order: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ContentItem' }] })
  items: Types.ObjectId[];
}

@Schema()
export class HomeScreenConfig extends Document {
  @Prop({ type: [Section], default: [] })
  sections: Section[];

  @Prop({ required: true, default: false })
  isActive: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const HomeScreenConfigSchema = SchemaFactory.createForClass(HomeScreenConfig); 
