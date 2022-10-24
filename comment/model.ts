import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

import type {User} from '../user/model';
import type {Freet} from '../freet/model';

export type Comment = {
  _id: Types.ObjectId;
  authorId?: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  freetId: Types.ObjectId;
  replyToId: Types.ObjectId;
  replyToModel: 'Comment' | 'Freet';

  numUpvotes: number;
  numDownvotes: number;
};

export type PopulatedComment = {
  _id: Types.ObjectId;
  authorId?: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  freetId: Freet;
  replyToId: Comment | Freet;
  replyToModel: 'Comment' | 'Freet';

  numUpvotes: number;
  numDownvotes: number;
};

const CommentSchema = new Schema<Comment>({
  authorId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'User'
  },
  dateCreated: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  dateModified: {
    type: Date,
    required: true
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  replyToId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'replyToModel'
  },
  replyToModel: {
    type: String,
    required: true,
    enum: ['Comment', 'Freet']
  }
});

CommentSchema.virtual('numUpvotes', {
  ref: 'Upvote',
  localField: '_id',
  foreignField: 'itemId',
  count: true,
  match: {
    vote: 'upvote',
    onModel: 'Comment'
  }
});

CommentSchema.virtual('numDownvotes', {
  ref: 'Upvote',
  localField: '_id',
  foreignField: 'itemId',
  count: true,
  match: {
    vote: 'downvote',
    onModel: 'Comment'
  }
});

const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
