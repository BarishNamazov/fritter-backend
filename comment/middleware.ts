import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';

import CommentCollection from './collection';

import {_canUserViewFreet} from '../freet/middleware';

const isValidCommentContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Comment content must be at least one character long.'
    });
    return;
  }

  next();
};

const isCommentExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.commentId) {
    res.status(400).json({
      error: 'Missing comment id.'
    });
    return;
  }

  if (!Types.ObjectId.isValid(req.params.commentId)) {
    res.status(400).json({
      error: 'Invalid comment id.'
    });
    return;
  }

  const comment = await CommentCollection.findOne(req.params.commentId);
  if (!comment) {
    res.status(404).json({
      error: `Comment with comment ID ${req.params.commentId} does not exist.`
    });
    return;
  }

  if (!comment.authorId) {
    res.status(403).json({
      error: 'This comment has been deleted.'
    });
    return;
  }

  next();
};

const isValidCommentModifier = async (req: Request, res: Response, next: NextFunction) => {
  const comment = await CommentCollection.findOne(req.params.commentId);
  const authorId = comment.authorId._id.toString();
  if ((req.session.userId as string) !== authorId) {
    res.status(403).json({
      error: 'Cannot modify other users\' comments.'
    });
    return;
  }

  next();
};

const isCommentAccessible = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.commentId) {
    res.status(400).json({
      error: 'Missing comment id.'
    });
    return;
  }

  const comment = await CommentCollection.findOne(req.params.commentId);
  const freet = comment.freetId;

  if (!await _canUserViewFreet(req.session.userId as string, freet._id.toString())) {
    res.status(403).json({
      error: 'You are not allowed to view this comment.'
    });
    return;
  }

  if (!comment.authorId) {
    res.status(403).json({
      error: 'This comment has been deleted.'
    });
    return;
  }

  next();
};

export {
  isValidCommentContent,
  isCommentExists,
  isValidCommentModifier,
  isCommentAccessible
};
