import type {HydratedDocument, Types} from 'mongoose';

import type {TakeBreak} from './model';
import TakeBreakModel from './model';

type MongoId = Types.ObjectId | string;

class TakeBreakCollection {
  static async startBreak(userId: MongoId): Promise<HydratedDocument<TakeBreak>> {
    const takeBreak = new TakeBreakModel({userId, dateStart: new Date()});
    await takeBreak.save();
    return takeBreak.populate('userId');
  }

  static async endBreak(userId: MongoId): Promise<HydratedDocument<TakeBreak>> {
    const takeBreak = await TakeBreakModel.findOne({userId, dateEnd: null});
    takeBreak.dateEnd = new Date();
    await takeBreak.save();
    return takeBreak.populate('userId');
  }
}

export default TakeBreakCollection;
