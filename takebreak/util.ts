import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {TakeBreak, PopulatedTakeBreak} from './model';

type TakeBreakResponse = {
  _id: string;
  userId: string;
  dateStart: string;
  dateEnd?: string;
};

const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

const constructTakeBreakResponse = (takeBreak: HydratedDocument<TakeBreak>): TakeBreakResponse => {
  const takeBreakCopy: PopulatedTakeBreak = {
    ...takeBreak.toObject({
      versionKey: false
    })
  };
  return {
    _id: takeBreakCopy._id.toString(),
    userId: takeBreakCopy.userId.username,
    dateStart: formatDate(takeBreak.dateStart),
    dateEnd: takeBreak.dateEnd ? formatDate(takeBreak.dateEnd) : undefined
  };
};

export {
  constructTakeBreakResponse
};
