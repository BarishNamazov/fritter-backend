import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Upvote = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  itemId: Types.ObjectId;
  dateVoted: Date;
  vote: 'upvote' | 'downvote';
  onModel: 'Freet' | 'Comment';
};

export type PopulatedUpvote = {
  _id: Types.ObjectId;
  userId: User;
  itemId: Types.ObjectId;
  dateVoted: Date;
  vote: 'upvote' | 'downvote';
  onModel: 'Freet' | 'Comment';
};

const UpvoteSchema = new Schema<Upvote>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  itemId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },
  dateVoted: {
    type: Date,
    required: true
  },
  vote: {
    type: String,
    required: true,
    enum: ['upvote', 'downvote'],
    default: 'upvote'
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Freet', 'Comment']
  }
});

const UpvoteModel = model<Upvote>('Upvote', UpvoteSchema);
export default UpvoteModel;
