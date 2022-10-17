import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import QuickAccessCollection from './collection';

const isValidEntries = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.entries) {
    res.status(400).json({
      error: {
        entries: 'No QuickAccess entries are given.'
      }
    });
    return;
  }

  next();
};

export {
  isValidEntries
};
