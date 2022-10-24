/* eslint-disable @typescript-eslint/restrict-template-expressions */
function voteFreet(fields) {
  fetch(`/api/upvotes/${fields.vote}/freet/${fields.freetId}`, {method: 'PUT'}).then(showResponse).catch(showResponse);
}

function unvoteFreet(fields) {
  fetch(`/api/upvotes/freet/${fields.freetId}`, {method: 'DELETE'}).then(showResponse).catch(showResponse);
}

function myVotes(fields) {
  fetch('/api/upvotes/my').then(showResponse).catch(showResponse);
}
