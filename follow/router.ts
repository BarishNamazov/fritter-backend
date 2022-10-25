import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import * as freetUtil from '../freet/util';
import * as followValidator from './middleware';

const router = express.Router();

router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const allFollowing = await FollowCollection.findAllByFollowerId(userId);
    const response = allFollowing.map(util.constructFollowResponse);
    res.status(200).json(response);
  }
);

router.put(
  '/:followee?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isValidFollowee,
    followValidator.isNotAlreadyFollowing
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const {followee} = req.params;
    const followeeId = (await UserCollection.findOneByUsername(followee))._id;
    const follow = await FollowCollection.addOne(userId, followeeId);
    res.status(201).json({
      message: `You are now following ${followee}.`,
      follow: util.constructFollowResponse(follow)
    });
  }
);

router.delete(
  '/:followee?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isValidFollowee,
    followValidator.isFollowing
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const {followee} = req.params;
    const followeeId = (await UserCollection.findOneByUsername(followee))._id;
    await FollowCollection.deleteOneByUserIds(userId, followeeId);
    res.status(200).json({
      message: `You unfollowed ${followee}.`
    });
  }
);

router.get(
  '/count/:followee?',
  [
    followValidator.isValidFollowee
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const {followee} = req.params;
    res.status(200).json({
      username: followee,
      followerCount: await FollowCollection.countFollowers(followee)
    });
  }
);

router.get(
  '/freets',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req.session;
    const allFollowing = await FollowCollection.findAllByFollowerId(userId);
    const allFolloweeIds = allFollowing.map(follow => follow.followee._id);
    const allFreets = await FreetCollection.findAllVisibleToUser(userId, {authorId: {$in: allFolloweeIds.concat([userId])}});
    const response = allFreets.map(freetUtil.constructFreetResponse);
    res.status(200).json(response);
  }
);

export {
  router as followRouter
};
