import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from '../follow/collection';
import UserCollection from '../user/collection';
import {FriendCollection, FriendRequestCollection} from './collection';
import * as UserValidator from '../user/middleware';
import * as FriendValidator from './middleware';
import * as util from './util';

const router = express.Router();

router.get(
  '/',
  [
    UserValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const allFriends = await FriendCollection.findAllFriends(userId);
    const response = allFriends.map(util.constructFriendResponse);
    res.status(200).json(response);
  }
);

router.delete(
  '/:friend?',
  [
    UserValidator.isUserLoggedIn,
    FriendValidator.isValidUser,
    FriendValidator.isFriend
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const {friend} = req.params;
    const friendId = (await UserCollection.findOneByUsername(friend))._id;
    await Promise.all([
      FriendCollection.deleteOneFriend(userId, friendId),
      FollowCollection.deleteOneIfFollows(userId, friendId)
    ]);

    res.status(200).json({
      message: `You unfriended ${friend}.`
    });
  }
);

router.get(
  '/requests',
  [
    UserValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const allFriendRequests = await FriendRequestCollection.findAllFriendRequests(userId);
    const response = allFriendRequests.map(util.constructFriendRequestResponse);
    res.status(200).json(response);
  }
);

router.put(
  '/requests/:requestee?',
  [
    UserValidator.isUserLoggedIn,
    FriendValidator.isValidUser,
    FriendValidator.isValidRequestee,
    FriendValidator.isNotAlreadyFriends,
    FriendValidator.isFriendRequestNotExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const {requestee} = req.params;
    const requesteeId = (await UserCollection.findOneByUsername(requestee))._id;
    const friendRequest = await FriendRequestCollection.addOneFriendRequest(userId, requesteeId);
    res.status(201).json({
      message: `You sent a friend request to ${requestee}.`,
      friendRequest: util.constructFriendRequestResponse(friendRequest)
    });
  }
);

router.delete(
  '/requests/:requestee?',
  [
    UserValidator.isUserLoggedIn,
    FriendValidator.isValidUser,
    FriendValidator.isFriendRequestExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const {requestee} = req.params;
    const requesteeId = (await UserCollection.findOneByUsername(requestee))._id;
    await FriendRequestCollection.deleteOneFriendRequest(userId, requesteeId);
    res.status(200).json({
      message: `You withdrew a friend request to ${requestee}.`
    });
  }
);

router.post(
  '/requests/:requester?',
  [
    UserValidator.isUserLoggedIn,
    FriendValidator.isValidUser,
    FriendValidator.isFriendRequestExists,
    FriendValidator.isValidResponse
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const {requester} = req.params;
    const response = req.body.response as string;
    const requesterId = (await UserCollection.findOneByUsername(requester))._id;
    const friendRequest = await FriendRequestCollection.findPendingFriendRequest(requesterId, userId);
    if (response === 'accept') {
      await Promise.all([
        FriendCollection.addOneFriend(userId, requesterId),
        FollowCollection.addOneIfNotExists(userId, requesterId),
        FollowCollection.addOneIfNotExists(requesterId, userId)
      ]);
    }

    await FriendRequestCollection.updateFriendRequest(requesterId, userId, `${response}ed`);

    res.status(200).json({
      message: `You ${response}ed a friend request from ${requester}.`,
      friendRequest: util.constructFriendRequestResponse(friendRequest)
    });
  }
);

export {
  router as friendRouter
};
