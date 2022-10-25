import type {NextFunction, Request, Response} from 'express';
import express from 'express';

import UpvoteCollection from './collection';
import FreetCollection from '../freet/collection';
import CommentCollection from '../comment/collection';
import * as freetValidator from '../freet/middleware';
import * as userValidator from '../user/middleware';
import * as commentValidator from '../comment/middleware';
import * as upvoteValidator from './middleware';

const router = express.Router();

router.get(
  '/my',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const freets = await UpvoteCollection.findAll({userId: req.session.userId as string, onModel: 'Freet'});
    const comments = await UpvoteCollection.findAll({userId: req.session.userId as string, onModel: 'Comment'});
    res.status(200).json({freets, comments});
  }
);

router.put(
  '/freet/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isFreetViewAllowed,
    upvoteValidator.isUpvoteValid
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const {freetId} = req.params;
    const vote = req.body.vote as 'upvote' | 'downvote';
    const oldUpvote = await UpvoteCollection.findOne(req.session.userId, freetId, 'Freet');
    let message;
    let statusCode = 200;
    if (oldUpvote && oldUpvote.vote === vote) {
      message = `Already ${vote}d this freet.`;
      statusCode = 409;
      await UpvoteCollection.deleteOneById(oldUpvote._id);
    } else if (oldUpvote && oldUpvote.vote !== vote) {
      message = `Changed vote from ${oldUpvote.vote} to ${vote}.`;
      await UpvoteCollection.deleteOneById(oldUpvote._id);
    } else {
      statusCode = 201;
      message = `Successfully ${vote}d this freet.`;
    }

    await UpvoteCollection.addOne(req.session.userId, freetId, 'Freet', vote);
    const freet = await FreetCollection.findOne(freetId);
    res.status(statusCode).json({
      message,
      upvotes: freet.numUpvotes,
      downvotes: freet.numDownvotes
    });
  }
);

router.delete(
  '/freet/:freetId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isFreetViewAllowed,
    upvoteValidator.isUpvoteExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    await UpvoteCollection.deleteOne(req.session.userId, req.params.freetId, 'Freet');
    const freet = await FreetCollection.findOne(req.params.freetId);
    res.status(200).json({
      message: 'Removed your vote for this freet.',
      upvotes: freet.numUpvotes,
      downvotes: freet.numDownvotes
    });
  }
);

router.put(
  '/comment/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isCommentAccessible,
    upvoteValidator.isUpvoteValid
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const {commentId} = req.params;
    const vote = req.body.vote as 'upvote' | 'downvote';
    const oldUpvote = await UpvoteCollection.findOne(req.session.userId, commentId, 'Comment');
    let message;
    let statusCode = 200;
    if (oldUpvote && oldUpvote.vote === vote) {
      message = `Already ${vote}d this comment.`;
      statusCode = 409;
      await UpvoteCollection.deleteOneById(oldUpvote._id);
    } else if (oldUpvote && oldUpvote.vote !== vote) {
      message = `Changed vote from ${oldUpvote.vote} to ${vote}.`;
      await UpvoteCollection.deleteOneById(oldUpvote._id);
    } else {
      statusCode = 201;
      message = `Successfully ${vote}d this comment.`;
    }

    await UpvoteCollection.addOne(req.session.userId, commentId, 'Comment', vote);
    const comment = await CommentCollection.findOne(commentId);
    res.status(statusCode).json({
      message,
      upvotes: comment.numUpvotes,
      downvotes: comment.numDownvotes
    });
  }
);

router.delete(
  '/freet/:commentId',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isCommentAccessible,
    upvoteValidator.isUpvoteExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    await UpvoteCollection.deleteOne(req.session.userId, req.params.commentId, 'Comment');
    const comment = await CommentCollection.findOne(req.params.commentId);
    res.status(200).json({
      message: 'Removed your vote for this comment.',
      upvotes: comment.numUpvotes,
      downvotes: comment.numDownvotes
    });
  }
);

export {
  router as upvoteRouter
};
