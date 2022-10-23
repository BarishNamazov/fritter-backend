import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import {FriendCollection, FriendRequestCollection} from './collection';
import UserCollection from 'user/collection';

const getFriendUsername = (params: Record<string, string>) => {
  if (params.friend) {
    return params.friend;
  }

  if (params.requester) {
    return params.requester;
  }

  if (params.requestee) {
    return params.requestee;
  }

  return '';
};

const isValidFriend = async (req: Request, res: Response, next: NextFunction) => {
  const friendUsername = getFriendUsername(req.params);
  if (!friendUsername) {
    return res.status(400).json({
      error: 'Username not provided.'
    });
  }

  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  if (!friendId) {
    return res.status(404).json({
      error: `User ${friendUsername} does not exist.`
    });
  }

  next();
};

const isFriend = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const friendUsername = getFriendUsername(req.params);
  if (!friendUsername) {
    return res.status(400).json({
      error: 'Username not provided.'
    });
  }

  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  const friend = await FriendCollection.findOneFriend(userId, friendId);
  if (!friend) {
    return res.status(400).json({
      error: `You are not friends with ${friendUsername}.`
    });
  }

  next();
};

const isNotAlreadyFriends = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const friendUsername = getFriendUsername(req.params);
  if (!friendUsername) {
    return res.status(400).json({
      error: 'Username not provided.'
    });
  }

  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  const friend = await FriendCollection.findOneFriend(userId, friendId);
  if (friend) {
    return res.status(400).json({
      error: `You are already friends with ${friendUsername}.`
    });
  }

  next();
};

const isFriendRequestExists = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const friendUsername = getFriendUsername(req.params);
  if (!friendUsername) {
    return res.status(400).json({
      error: 'Username not provided.'
    });
  }

  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  const friendRequest = await FriendRequestCollection.findPendingFriendRequest(userId, friendId);
  if (!friendRequest) {
    return res.status(400).json({
      error: `You currently do not have a pending friend request to ${friendUsername}.`
    });
  }

  next();
};

const isFriendRequestNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const friendUsername = getFriendUsername(req.params);
  if (!friendUsername) {
    return res.status(400).json({
      error: 'Username not provided.'
    });
  }

  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  const friendRequest = await FriendRequestCollection.findPendingFriendRequest(userId, friendId);
  if (friendRequest) {
    return res.status(400).json({
      error: `You already have a pending friend request to ${friendUsername}.`
    });
  }

  next();
};

const isValidRequestee = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const friendUsername = getFriendUsername(req.params);
  if (!friendUsername) {
    return res.status(400).json({
      error: 'Username not provided.'
    });
  }

  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  if (userId === friendId.toString()) {
    return res.status(400).json({
      error: 'You cannot send a friend request to yourself.'
    });
  }

  next();
};

const isValidRequester = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const friendUsername = getFriendUsername(req.params);
  if (!friendUsername) {
    return res.status(400).json({
      error: 'Username not provided.'
    });
  }

  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  const friendRequest = await FriendRequestCollection.findPendingFriendRequest(friendId, userId);
  if (!friendRequest) {
    return res.status(400).json({
      error: `You do not have a pending friend request from ${friendUsername}.`
    });
  }

  next();
};

const isValidResponse = async (req: Request, res: Response, next: NextFunction) => {
  const response = req.body.response as string;
  if (response !== 'accept' && response !== 'reject') {
    return res.status(400).json({
      error: 'Invalid response. Needs to be either accept or reject.'
    });
  }

  next();
};

export {
  isValidFriend,
  isFriend,
  isNotAlreadyFriends,
  isFriendRequestExists,
  isFriendRequestNotExists,
  isValidRequestee,
  isValidRequester,
  isValidResponse
};
