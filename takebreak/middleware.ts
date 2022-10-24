import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';

import TakeBreakCollection from '../takebreak/collection';
import UserCollection from '../user/collection';

const isNotTakingBreak = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const user = await ((await UserCollection.findOneByUserId(userId)).populate('currentTakeBreak'));
  if (user.currentTakeBreak) {
    res.status(409).json({
      error: 'You are already taking a break right now.'
    });
    return;
  }

  next();
};

const isTakingBreak = async (req: Request, res: Response, next: NextFunction) => {
  const user = await ((await UserCollection.findOneByUsername(req.body.username)).populate('currentTakeBreak'));
  if (!user.currentTakeBreak) {
    res.status(409).json({
      error: 'You are already not taking a break right now.'
    });
    return;
  }

  next();
};

export {
  isNotTakingBreak,
  isTakingBreak
};
