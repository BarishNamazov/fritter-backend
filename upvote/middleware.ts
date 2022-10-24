import type {Request, Response, NextFunction} from 'express';

import UpvoteCollection from './collection';

const getParams = (req: Request) => {
  if (req.params.freetId) {
    return [req.params.freetId, 'Freet'];
  }

  if (req.params.commentId) {
    return [req.params.commentId, 'Comment'];
  }
};

const isUpvoteExists = async (req: Request, res: Response, next: NextFunction) => {
  const params = getParams(req);
  const upvote = await UpvoteCollection.findOne(req.session.userId, params[0], params[1] as 'Freet' | 'Comment');
  if (!upvote) {
    res.status(404).json({
      error: 'Vote does not exist.'
    });
    return;
  }

  next();
};

const isUpvoteValid = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const vote = req.body.vote as string;
  console.log(vote);
  if (!vote || (vote !== 'upvote' && vote !== 'downvote')) {
    res.status(400).json({
      error: 'Invalid vote.'
    });
    return;
  }

  next();
};

export {
  isUpvoteExists,
  isUpvoteValid
};
