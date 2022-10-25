import type {NextFunction, Request, Response} from 'express';
import express from 'express';

import CommentCollection from './collection';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';

import * as commentValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as userValidator from '../user/middleware';

import * as util from './util';
import type {PopulatedComment} from './model';

const router = express.Router();

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.author !== undefined && req.query.freetId !== undefined) {
      next();
      return;
    }

    if (req.query.author !== undefined || req.query.freetId !== undefined) {
      next('route');
      return;
    }

    const allComments = await CommentCollection.findAllVisibleToUser(req.session.userId);
    const response = allComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists,
    freetValidator.isFreetExistsQuery
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const author = await UserCollection.findOneByUsername(req.query.author as string);
    const authorComments = await CommentCollection.findAllVisibleToUser(req.session.userId, {authorId: author._id, freetId: req.query.freetId});
    const response = authorComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  }
);

// I hate this code, but it is harder to do this in a single route while having fancy error messsages.

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetId !== undefined) {
      next();
      return;
    }

    if (!req.query.author) {
      res.status(400).json({error: 'Provided author username must be nonempty.'});
    }

    if (!await UserCollection.findOneByUsername(req.query.author as string)) {
      res.status(404).json({error: `A user with username ${req.query.author as string} does not exist.`});
      return;
    }

    const author = await UserCollection.findOneByUsername(req.query.author as string);
    const authorComments = await CommentCollection.findAllVisibleToUser(req.session.userId, {authorId: author._id});
    const response = authorComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  },
  [
    freetValidator.isFreetExistsQuery
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const authorComments = await CommentCollection.findAllVisibleToUser(req.session.userId, {freetId: req.query.freetId});
    const response = authorComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  }
);

router.post(
  '/onfreet/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isFreetViewAllowed,
    commentValidator.isValidCommentContent
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const comment = await CommentCollection.addOne(userId, req.params.freetId, req.params.freetId, 'Freet', req.body);
    res.status(201).json({
      message: `Comment successfully added to freet with id ${req.params.freetId}.`,
      comment: util.constructCommentResponse(comment)
    });
  }
);

router.post(
  '/oncomment/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isCommentAccessible,
    commentValidator.isValidCommentContent
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const replyToComment = await CommentCollection.findOne(req.params.commentId);
    const comment = await CommentCollection.addOne(userId, replyToComment.freetId, req.params.commentId, 'Comment', req.body);
    res.status(201).json({
      message: `Comment successfully added to comment with id ${req.params.commentId}.`,
      comment: util.constructCommentResponse(comment)
    });
  }
);

router.put(
  '/:commentId',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isCommentAccessible,
    commentValidator.isValidCommentModifier,
    commentValidator.isValidCommentContent
  ],
  async (req: Request, res: Response) => {
    const comment = await CommentCollection.updateOne(req.params.commentId, req.body);
    res.status(200).json({
      message: `Comment with id ${req.params.commentId} successfully updated.`,
      comment: util.constructCommentResponse(comment)
    });
  }
);

router.delete(
  '/:commentId',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isCommentAccessible,
    commentValidator.isValidCommentModifier
  ],
  async (req: Request, res: Response) => {
    const comment = await CommentCollection.findOne(req.params.commentId);
    comment.authorId = null;
    comment.content = '[comment deleted]';
    await comment.save();

    res.status(200).json({
      message: `Comment with id ${req.params.commentId} will appear as deleted with no author shown.`
    });
  }
);

export {
  router as commentRouter
};
