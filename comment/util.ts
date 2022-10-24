import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Comment, PopulatedComment} from './model';

type CommentResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  freetId: string;
  numUpvotes: number;
  numDownvotes: number;
};

const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

const constructCommentResponse = (comment: HydratedDocument<Comment>): CommentResponse => {
  const commentCopy: PopulatedComment = {
    ...comment.toObject({
      versionKey: false,
      virtuals: true
    })
  };

  let username;
  if (commentCopy.authorId) {
    username = commentCopy.authorId.username;
  } else {
    username = '[comment deleted]';
  }

  const freetId = commentCopy.freetId._id.toString();
  delete commentCopy.authorId;
  delete commentCopy.freetId;
  return {
    ...commentCopy,
    author: username,
    _id: commentCopy._id.toString(),
    dateCreated: formatDate(comment.dateCreated),
    dateModified: formatDate(comment.dateModified),
    freetId
  };
};

export {
  constructCommentResponse
};
