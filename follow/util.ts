import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Follow, PopulatedFollow} from './model';

type FollowResponse = {
  _id: string;
  followerUsername: string;
  followeeUsername: string;
  dateFollowing: Date;
};

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A Follow object
 * @returns {FollowResponse} - The follow object
 */
const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: PopulatedFollow = {
    ...follow.toObject()
  };
  const followerUsername = followCopy.follower.username;
  const followeeUsername = followCopy.followee.username;
  return {
    _id: followCopy._id.toString(),
    followerUsername,
    followeeUsername,
    dateFollowing: followCopy.dateFollowing
  };
};

export {
  constructFollowResponse
};
