import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Follow = {
  _id: Types.ObjectId;
  follower: Types.ObjectId; // Who is following
  followee: Types.ObjectId; // Who is being followed
  dateFollowing: Date; // Following since when
};

export type PopulatedFollow = {
  _id: Types.ObjectId;
  follower: User; // Who is following
  followee: User; // Who is being followed
  dateFollowing: Date; // Following since when
};

const FollowSchema = new Schema<Follow>({
  follower: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  followee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  dateFollowing: {
    type: Date,
    required: true
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
