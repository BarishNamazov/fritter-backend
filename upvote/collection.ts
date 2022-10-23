import type {HydratedDocument, Types} from 'mongoose';
import type {Upvote} from './model';
import UpvoteModel from './model';

type MongoId = Types.ObjectId | string;

class UpvoteCollection {
  static async addOne(userId: MongoId, itemId: MongoId, onModel: 'Freet' | 'Comment', vote: 'upvote' | 'downvote'): Promise<HydratedDocument<Upvote>> {
    const upvote = new UpvoteModel({
      userId,
      itemId,
      dateVoted: new Date(),
      vote,
      onModel
    });
    await upvote.save();
    return upvote.populate('userId');
  }

  static async findOne(userId: MongoId, itemId: MongoId, onModel: 'Freet' | 'Comment'): Promise<HydratedDocument<Upvote>> {
    return UpvoteModel.findOne({userId, itemId, onModel}).populate('userId');
  }

  static async deleteOne(userId: MongoId, itemId: MongoId, onModel: 'Freet' | 'Comment'): Promise<void> {
    await UpvoteModel.deleteOne({userId, itemId, onModel});
  }

  static async updateOne(userId: MongoId, itemId: MongoId, onModel: 'Freet' | 'Comment', vote: 'upvote' | 'downvote'): Promise<HydratedDocument<Upvote>> {
    const upvote = await UpvoteModel.findOne({userId, itemId, onModel});
    upvote.vote = vote;
    await upvote.save();
    return upvote.populate('userId');
  }

  static async getUpvotes(itemId: MongoId, onModel: 'Freet' | 'Comment'): Promise<Array<HydratedDocument<Upvote>>> {
    return UpvoteModel.find({itemId, onModel, vote: 'upvote'}).populate('userId');
  }

  static async getVotes(itemId: MongoId, onModel: 'Freet' | 'Comment'): Promise<[number, number]> {
    const upvotes = await UpvoteModel.find({itemId, onModel, vote: 'upvote'});
    const downvotes = await UpvoteModel.find({itemId, onModel, vote: 'downvote'});
    return [upvotes.length, downvotes.length];
  }
}
