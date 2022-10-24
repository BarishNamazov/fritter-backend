import type {HydratedDocument, Types} from 'mongoose';
import type {Comment} from './model';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

import CommentModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

type MongoId = Types.ObjectId | string;

class CommentCollection {
  static async addOne(authorId: MongoId, freetId: MongoId, commentDetails: Record<string, string>): Promise<HydratedDocument<Comment>> {
    const date = new Date();
    const comment = new CommentModel({
      authorId,
      dateCreated: date,
      content: commentDetails.content,
      dateModified: date,
      freetId
    });
    await comment.save();
    return comment.populate(['authorId', 'freetId']);
  }

  static async findOne(commentId: MongoId): Promise<HydratedDocument<Comment>> {
    return CommentModel.findById(commentId).populate(['authorId', 'freetId']);
  }

  static async findAll(filter: Record<string, any> = {}): Promise<Array<HydratedDocument<Comment>>> {
    return CommentModel.find(filter).sort({dateModified: -1}).populate(['authorId', 'freetId']);
  }

  static async updateOne(commentId: MongoId, commentDetails: Record<string, string>): Promise<HydratedDocument<Comment>> {
    const comment = await CommentCollection.findOne(commentId);
    comment.content = commentDetails.content;
    comment.dateModified = new Date();
    await comment.save();
    return comment;
  }

  static async deleteOne(commentId: MongoId): Promise<HydratedDocument<Comment>> {
    const comment = await CommentCollection.findOne(commentId);
    await comment.remove();
    return comment;
  }

  static async deleteManyByFreetId(freetId: MongoId): Promise<Array<HydratedDocument<Comment>>> {
    const comments = await CommentCollection.findAll({freetId});
    await CommentModel.deleteMany({freetId});
    return comments;
  }
}

export default CommentCollection;