import type {Request, Response} from 'express';
import express from 'express';
import QuickAccessCollection from './collection';
import * as quickAccessValidator from './middleware';
import * as userValidator from '../user/middleware';

const router = express.Router();

router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const quickAccess = await QuickAccessCollection.findOneByUserId(userId);
    console.log(quickAccess);
    res.status(200).json({
      entries: quickAccess.entries
    });
  }
);

router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    quickAccessValidator.isValidEntries
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    console.log(req.body.entries);
    const quickAccess = await QuickAccessCollection.updateOneByUserId(
      userId, req.body.entries
    );
    res.status(200).json({
      message: 'Quick Accesss list successfully updated.'
    });
  }
);

export {router as quickAccessRouter};
