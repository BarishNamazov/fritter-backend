import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {QuickAccess} from './model';

type QuickAccessResponse = {
  entries: Array<{name: string; url: string}>;
  dateUpdated: Date;
};

/**
 * Transform a raw QuickAccess object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<QuickAccess>} quickAccess - A QuickAccess object
 * @returns {QuickAccessResponse} - The QuickAccess object
 */
const constructQuickAccessResponse = (quickAccess: HydratedDocument<QuickAccess>): QuickAccessResponse => {
  const {entries, dateUpdated} = quickAccess;
  return {entries, dateUpdated}; // Intentionally sending Date object instead of fancy string
};

export {
  constructQuickAccessResponse
};
