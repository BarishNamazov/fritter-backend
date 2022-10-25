import type {HydratedDocument, Types} from 'mongoose';
import type {QuickAccess} from './model';
import QuickAccessModel from './model';

class QuickAccessCollection {
  /**
   * Find a QuickAccess by userId. If does not exist, creates one and returns that.
   *
   * @param userId - The _id to look for an entry for
   * @returns The entry with the given id, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<QuickAccess>> {
    const one = await QuickAccessModel.findOne({userId});
    if (!one) {
      const populate = new QuickAccessModel({userId, dateUpdated: new Date()});
      await populate.save();
      return populate;
    }

    return one;
  }

  /**
   * Find a QuickAccess by quickAccessId.
   *
   * @param quickAccessId - The _id to look for an entry for
   * @returns The entry with the given id, if any
   */
  static async findOneByQuickAccessId(quickAccessId: Types.ObjectId | string): Promise<HydratedDocument<QuickAccess>> {
    return QuickAccessModel.findOne({_id: quickAccessId});
  }

  /**
   * Update by quickAccessId.
   *
   * @param quickAccessId - The _id of QuickAccess entry to update
   * @param quickAccessEntries - QuickAccess entries
   * @returns - The updated QuickAccess entry.
   */
  static async updateOneByQuickAccessId(quickAccessId: Types.ObjectId | string, quickAccessEntries: Array<{name: string; url: string}>): Promise<HydratedDocument<QuickAccess>> {
    const quickAccess = await QuickAccessModel.findOne({_id: quickAccessId});
    quickAccess.entries = quickAccessEntries;
    quickAccess.dateUpdated = new Date();
    await quickAccess.save();
    return quickAccess;
  }

  /**
   * Update by userId.
   *
   * @param userId - The _id of QuickAccess entry to update
   * @param quickAccessEntries - QuickAccess entries
   * @returns - The updated QuickAccess entry.
   */
  static async updateOneByUserId(userId: Types.ObjectId | string, quickAccessEntries: Array<{name: string; url: string}>): Promise<HydratedDocument<QuickAccess>> {
    const quickAccess = await this.findOneByUserId(userId);
    quickAccess.entries = quickAccessEntries;
    quickAccess.dateUpdated = new Date();
    await quickAccess.save();
    return quickAccess;
  }
}

export default QuickAccessCollection;
