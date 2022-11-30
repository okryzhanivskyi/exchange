import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type PictureDocument = HydratedDocument<Picture>;

@Schema()
export class Picture {

  @Prop({
    required: true
  })
  title: string;

  @Prop({
    required: true
  })
  description: string;

  @Prop({
    required: true
  })
  filename: string;

  @Prop({
    required: true
  })
  channels: string[];

  @Prop({
    required: true
  })
  uploadedBy: string;

  @Prop({
    type: Date,
    required: true,
    default: Date.now()
  })
  date: Date;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
