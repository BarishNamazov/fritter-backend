import type {Request, Response, NextFunction} from 'express';
import {FriendCollection} from 'friend/collection';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  // Do not want the following check
  // if (content.length > 140) {
  //   res.status(413).json({
  //     error: 'Freet content must be no more than 140 characters.'
  //   });
  //   return;
  // }

  const {visibility} = req.body as {visibility: string};
  if (visibility !== 'public' && visibility !== 'friends' && visibility !== 'only me') {
    res.status(400).json({
      error: 'Freet visibility must be either public, friends, or only me.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

const isFreetViewAllowed = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);

  if (freet.visibility === 'public') {
    next();
    return;
  }

  if (!req.session.userId) {
    res.status(403).json({
      error: 'Not allowed to view this freet.'
    });
    return;
  }

  const userId = req.session.userId as string;

  if (freet.visibility === 'only me' && userId !== freet.authorId._id.toString()) {
    res.status(403).json({
      error: 'Not allowed to view this freet.'
    });
    return;
  }

  if (freet.visibility === 'friends' && !(await FriendCollection.findOneFriend(userId, freet.authorId._id.toString()))) {
    res.status(403).json({
      error: 'Not allowed to view this freet.'
    });
    return;
  }

  next();
};

export {
  isValidFreetContent,
  isFreetExists,
  isValidFreetModifier,
  isFreetViewAllowed
};
