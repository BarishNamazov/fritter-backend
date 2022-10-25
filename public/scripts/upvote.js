/* eslint-disable @typescript-eslint/restrict-template-expressions */
function voteThing(fields) {
  fetch(`/api/upvotes/${fields.vote}/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}}).then(showResponse).catch(showResponse);
}

function unvoteThing(fields) {
  fetch(`/api/upvotes/${fields.vote}/${fields.id}`, {method: 'DELETE'}).then(showResponse).catch(showResponse);
}

function myVotes(fields) {
  fetch('/api/upvotes/my').then(showResponse).catch(showResponse);
}
