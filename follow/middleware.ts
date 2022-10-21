import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FollowCollection from './collection';
import UserCollection from '../user/collection';

const isValidFollowee = async (req: Request, res: Response, next: NextFunction) => {
  const followee = (req.body.followee || req.query.followee) as string;
  if (followee === null) {
    res.status(400).json({error: 'Missing followee argument in request.'});
    return;
  }

  const user = await UserCollection.findOneByUsername(followee);
  if (user) {
    next();
  } else {
    res.status(404).json({error: `User with username "${followee}" could not be found.`});
  }
};

const isNotAlreadyFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const followee = (req.body.followee || req.query.followee) as string;

  const followerId = req.session.userId as string;
  const followeeId = (await UserCollection.findOneByUsername(followee))._id ?? '' as string;

  if (followerId === followeeId) {
    res.status(409).json({error: 'You cannot follow yourself.'});
    return;
  }

  const follow = await FollowCollection.deleteOneByUserIds(followerId, followeeId);
  if (follow) {
    res.status(409).json({error: `You are already following user with username "${followee}"`});
  } else {
    next();
  }
};

const isFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const followee = (req.body.followee || req.query.followee) as string;

  const followerId = req.session.userId as string;
  const followeeId = (await UserCollection.findOneByUsername(followee))._id ?? '' as string;

  if (followerId === followeeId) {
    res.status(409).json({error: 'You cannot unfollow yourself.'});
    return;
  }

  const follow = await FollowCollection.deleteOneByUserIds(followerId, followeeId);
  if (follow) {
    next();
  } else {
    res.status(404).json({error: `You are already not following user with username "${followee}"`});
  }
};

export {
  isValidFollowee,
  isNotAlreadyFollowing,
  isFollowing
};