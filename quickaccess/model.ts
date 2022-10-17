import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type QuickAccess = {
  _id: Types.ObjectId;
  name: string;
  url: string;
  order: number;
};

const QuickAccessSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

const QuickAccessModel = model<QuickAccess>('QuickAccess', QuickAccessSchema);
export default QuickAccessModel;
