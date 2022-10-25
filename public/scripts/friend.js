/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
function getFriends(fields) {
  fetch(`/api/friends/list/${fields.friend || ''}`, {method: 'GET'}).then(showResponse).catch(showResponse);
}

function unfriend(fields) {
  fetch(`/api/friends/list/${fields.friend}`, {method: 'DELETE'}).then(showResponse).catch(showResponse);
}

function getFriendRequests(fields) {
  fetch('/api/friends/requests', {method: 'GET'}).then(showResponse).catch(showResponse);
}

function requestFriend(fields) {
  fetch(`/api/friends/requests/${fields.friend}`, {method: 'PUT'}).then(showResponse).catch(showResponse);
}

function withdrawRequest(fields) {
  fetch(`/api/friends/requests/${fields.friend}`, {method: 'DELETE'}).then(showResponse).catch(showResponse);
}

function respondRequest(fields) {
  fetch(`/api/friends/requests/respond/${fields.friend}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}}).then(showResponse).catch(showResponse);
}
