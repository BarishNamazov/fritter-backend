import type {Request, Response} from 'express';
import express from 'express';
import QuickAccessCollection from './collection';
import * as quickAccessValidator from './middleware';
import * as userValidator from '../user/middleware';
import {constructQuickAccessResponse} from './util';

const router = express.Router();

router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const quickAccess = await QuickAccessCollection.findOneByUserId(userId);
    res.status(200).json({
      quickAccess: constructQuickAccessResponse(quickAccess)
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
    const userId = req.session.userId as string;
    console.log(req.session.userId, req.body.entries);
    const quickAccess = await QuickAccessCollection.updateOneByUserId(
      userId, req.body.entries
    );
    res.status(200).json({
      message: 'Quick Accesss list successfully updated.',
      quickAccess: constructQuickAccessResponse(quickAccess)
    });
  }
);

export {router as quickAccessRouter};
