import type {NextFunction, Request, Response} from 'express';
import express from 'express';

import TakeBreakCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as takeBreakValidator from './middleware';
import * as util from './util';
import * as freetUtil from '../freet/util';

import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import type {PopulatedTakeBreak} from './model';

const router = express.Router();

router.put(
  '/start',
  [
    userValidator.isUserLoggedIn,
    takeBreakValidator.isNotTakingBreak,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const freet = await FreetCollection.addOne(userId, req.body);
    const takeBreak = await TakeBreakCollection.startBreak(userId);
    req.session.userId = undefined;
    res.status(201).json({
      message: 'You have started taking a break.',
      freet: freetUtil.constructFreetResponse(freet),
      takeBreak: util.constructTakeBreakResponse(takeBreak)
    });
  }
);

router.put(
  '/end',
  [
    userValidator.isUserLoggedOut,
    userValidator.isAccountExists,
    takeBreakValidator.isTakingBreak,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUsername(req.body.username);
    const takeBreak = await TakeBreakCollection.endBreak(user._id);
    const freet = await FreetCollection.addOne(user._id, req.body);
    req.session.userId = user._id;
    res.status(201).json({
      message: 'You have ended your break and logged in.',
      freet: freetUtil.constructFreetResponse(freet),
      takeBreak: util.constructTakeBreakResponse(takeBreak)
    });
  }
);

export {
  router as takeBreakRouter
};
