import type {HydratedDocument, Types} from 'mongoose';
import UserCollection from '../user/collection';
import type {Follow} from './model';
import FollowModel from './model';

type MongoId = Types.ObjectId | string;
type FollowPromise = Promise<HydratedDocument<Follow>>;
type FollowsPromise = Promise<Array<HydratedDocument<Follow>>>;

class FollowCollection {
  static async addOne(follower: MongoId, followee: MongoId): FollowPromise {
    const follow = new FollowModel({
      follower, followee, date: new Date()
    });
    await follow.save();
    return follow.populate(['follower', 'followee']);
  }

  static async findOneById(followId: MongoId): FollowPromise {
    return FollowModel.findOne({_id: followId}).populate(['follower', 'followee']);
  }

  static async findAllByFollowerId(follower: MongoId): FollowsPromise {
    return FollowModel.find({follower}).sort({dateFollowing: -1}).populate(['follower', 'followee']);
  }

  static async findAllByFolloweeId(followee: MongoId): FollowsPromise {
    return FollowModel.find({followee}).sort({dateFollowing: -1}).populate(['follower', 'followee']);
  }

  static async findAllByFollowerUsername(followerUsername: string): FollowsPromise {
    const follower = await UserCollection.findOneByUsername(followerUsername);
    return this.findAllByFollowerId(follower._id);
  }

  static async findAllByFolloweeUsername(followeeUsername: string): FollowsPromise {
    const followee = await UserCollection.findOneByUsername(followeeUsername);
    return this.findAllByFolloweeId(followee._id);
  }

  static async deleteOneById(followId: MongoId): Promise<boolean> {
    const follow = await FollowModel.deleteOne({_id: followId});
    return follow !== null;
  }

  static async deleteOneByUserIds(follower: MongoId, followee: MongoId): Promise<boolean> {
    const follow = await FollowModel.findOne({follower, followee});
    return this.deleteOneById(follow._id);
  }
}

export default FollowCollection;
