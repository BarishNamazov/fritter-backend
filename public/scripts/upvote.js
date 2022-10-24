/* eslint-disable @typescript-eslint/restrict-template-expressions */
function voteFreet(fields) {
  console.log(fields);
  fetch(`/api/upvotes/freet/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}}).then(showResponse).catch(showResponse);
}

function unvoteFreet(fields) {
  fetch(`/api/upvotes/freet/${fields.id}`, {method: 'DELETE'}).then(showResponse).catch(showResponse);
}

function myVotes(fields) {
  fetch('/api/upvotes/my').then(showResponse).catch(showResponse);
}
