import {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type TakeBreak = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  dateStart: Date;
  dateEnd?: Date;
};

export type PopulatedTakeBreak = {
  _id: Types.ObjectId;
  userId: User;
  dateStart: Date;
  dateEnd?: Date;
};

const TakeBreakSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  dateStart: {
    type: Date,
    required: true
  },
  dateEnd: {
    type: Date,
    required: false
  }
});

const TakeBreakModel = model<TakeBreak>('TakeBreak', TakeBreakSchema);
export default TakeBreakModel;
