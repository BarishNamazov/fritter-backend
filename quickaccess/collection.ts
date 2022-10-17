import type {HydratedDocument, Types} from 'mongoose';
import type {QuickAccess} from './model';
import QuickAccessModel from './model';

class QuickAccessCollection {
  /**
   * Find by _id.
   *
   * @param quickAccessId - The _id to look for an entry for
   * @returns The entry with the given id, if any
   */
  static async findOneById(quickAccessId: Types.ObjectId | string): Promise<HydratedDocument<QuickAccess>> {
    return QuickAccessModel.findOne({_id: quickAccessId});
  }

  /**
   * Find by a name.
   *
   * @param name - The name to look for an entry for
   * @returns The entry with the given name, if any
   */
  static async findOneByName(name: string): Promise<HydratedDocument<QuickAccess>> {
    return QuickAccessModel.findOne({name: name.trim()});
  }

  /**
   * Add a new QuickAccess entry to the end of the existing entries.
   *
   * @param name - The name of the new QuickAccess entry
   * @param url - The URL of the new QuickAccess entry
   */
  static async addOne(name: string, url: string): Promise<HydratedDocument<QuickAccess>> {
    const count = await QuickAccessModel.countDocuments({});
    const quickAccess = new QuickAccessModel({name, url, order: count});
    await quickAccess.save();
    return quickAccess;
  }

  /**
   * Update QuickAccess entry name or URL.
   *
   * @param quickAccessId - The _id of QuickAccess entry to update
   * @param details - An object with new updates
   * @returns - The updated QuickAccess entry.
   */
  static async updateOne(quickAccessId: Types.ObjectId | string, details: any): Promise<HydratedDocument<QuickAccess>> {
    const quickAccess = await QuickAccessModel.findOne({_id: quickAccessId});
    if (details.name) {
      quickAccess.name = details.name as string;
    }

    if (details.url) {
      quickAccess.url = details.url as string;
    }

    await quickAccess.save();
    return quickAccess;
  }

  /**
   * Updates all QuickAccess entries with given order.
   *
   * @param quickAccessEntries - The ordered array of QuickAccesss entries
   */
  static async updateAll(quickAccessEntries: Array<{name: string; url: string}>) {
    await QuickAccessModel.deleteMany({});
    const promises: Array<Promise<any>> = [];
    for (const [order, entry] of quickAccessEntries.entries()) {
      const quickAccess = new QuickAccessModel({...entry, order});
      promises.push(quickAccess.save());
    }

    await Promise.all(promises);
  }
}

export default QuickAccessCollection;
