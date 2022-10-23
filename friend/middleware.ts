import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import {FriendCollection, FriendRequestCollection} from './collection';
import UserCollection from 'user/collection';

const isValidFriend = async (req: Request, res: Response, next: NextFunction) => {
  const {friendUsername} = req.params;
  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  if (!friendId) {
    return res.status(404).json({
      message: `User ${friendUsername} does not exist.`
    });
  }

  next();
};

const isFriend = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const {friendUsername} = req.params;
  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  const friend = await FriendCollection.findOneFriend(userId, friendId);
  if (!friend) {
    return res.status(400).json({
      message: `You are not friends with ${friendUsername}.`
    });
  }

  next();
};

const isNotAlreadyFriends = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const {friendUsername} = req.params;
  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  const friend = await FriendCollection.findOneFriend(userId, friendId);
  if (friend) {
    return res.status(400).json({
      message: `You are already friends with ${friendUsername}.`
    });
  }

  next();
};

const isFriendRequestExists = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const {friendUsername} = req.params;
  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  const friendRequest = await FriendRequestCollection.findPendingFriendRequest(userId, friendId);
  if (!friendRequest) {
    return res.status(400).json({
      message: `You currently do not have a pending friend request to ${friendUsername}.`
    });
  }

  next();
};

const isFriendRequestNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const {friendUsername} = req.params;
  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  const friendRequest = await FriendRequestCollection.findPendingFriendRequest(userId, friendId);
  if (friendRequest) {
    return res.status(400).json({
      message: `You already have a pending friend request to ${friendUsername}.`
    });
  }

  next();
};

const isValidRequestee = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const {friendUsername} = req.params;
  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  if (userId === friendId.toString()) {
    return res.status(400).json({
      message: 'You cannot send a friend request to yourself.'
    });
  }

  next();
};

const isValidRequester = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const {friendUsername} = req.params;
  const friendId = (await UserCollection.findOneByUsername(friendUsername))._id;
  const friendRequest = await FriendRequestCollection.findPendingFriendRequest(friendId, userId);
  if (!friendRequest) {
    return res.status(400).json({
      message: `You do not have a pending friend request from ${friendUsername}.`
    });
  }

  next();
};

const isValidResponse = async (req: Request, res: Response, next: NextFunction) => {
  const response = req.body.response as string;
  if (response !== 'accept' && response !== 'reject') {
    return res.status(400).json({
      message: 'Invalid response. Needs to be either accept or reject.'
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
