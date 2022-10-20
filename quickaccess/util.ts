import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {QuickAccess} from './model';

type QuickAccessResponse = {
  _id: string;
  userId: string;
  entries: Array<{name: string; url: string}>;
  dateUpdated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw QuickAccess object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<QuickAccess>} quickAccess - A QuickAccess object
 * @returns {QuickAccessResponse} - The user object without the password
 */
const constructQuickAccessResponse = (quickAccess: HydratedDocument<QuickAccess>): QuickAccessResponse => ({
  ...quickAccess.toObject({versionKey: false}),
  userId: quickAccess.userId.toString(),
  _id: quickAccess._id.toString(),
  dateUpdated: formatDate(quickAccess.dateUpdated)
});

export {
  constructQuickAccessResponse
};
