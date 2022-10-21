import {BASEURL} from '../global';
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type QuickAccess = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  entries: Array<{name: string; url: string}>;
  dateUpdated: Date;
};

const QuickAccessSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  entries: {
    type: [{
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }],
    _id: false,
    required: true,
    default: [{name: 'Fritter Home', url: BASEURL}]
  },
  dateUpdated: {
    type: Date,
    required: true
  }
}, {
  toObject: {versionKey: false}
});

QuickAccessSchema.index({userId: 1});

const QuickAccessModel = model<QuickAccess>('QuickAccess', QuickAccessSchema);
export default QuickAccessModel;
