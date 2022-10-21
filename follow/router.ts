import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
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

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.isValidFollowee,
    followValidator.isNotAlreadyFollowing
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const followee = req.body.followee as string;
    const followeeId = (await UserCollection.findOneByUsername(followee))._id;
    const follow = await FollowCollection.addOne(userId, followeeId);
    res.status(201).json({
      message: `You are now following ${followee}`,
      follow: util.constructFollowResponse(follow)
    });
  }
);

router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.isValidFollowee,
    followValidator.isFollowing
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const followee = req.body.followee as string;
    const followeeId = (await UserCollection.findOneByUsername(followee))._id;
    await FollowCollection.deleteOneByUserIds(userId, followeeId);
    res.status(200).json({
      message: `You unfollowed ${followee}`
    });
  }
);
