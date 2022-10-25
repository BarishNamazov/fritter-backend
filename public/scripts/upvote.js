/* eslint-disable @typescript-eslint/restrict-template-expressions */
function voteThing(fields) {
  fetch(`/api/votes/${fields.model}/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}}).then(showResponse).catch(showResponse);
}

function unvoteThing(fields) {
  fetch(`/api/votes/${fields.model}/${fields.id}`, {method: 'DELETE'}).then(showResponse).catch(showResponse);
}

function myVotes(fields) {
  fetch('/api/votes/my').then(showResponse).catch(showResponse);
}
