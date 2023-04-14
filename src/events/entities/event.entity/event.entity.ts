import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';

@Schema()
export class Event extends Document {
    @Prop()
    type: string;

    @Prop({ index: true })
    name: string;

    @Prop(SchemaTypes.Mixed)
    payload: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);