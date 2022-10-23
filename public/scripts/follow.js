/* eslint-disable @typescript-eslint/restrict-template-expressions */
function getFollowings(fields) {
  fetch('/api/follows', {method: 'GET'}).then(showResponse).catch(showResponse);
}

function follow(fields) {
  fetch(`/api/follows/${fields.followee}`, {method: 'PUT'}).then(showResponse).catch(showResponse);
}

function unfollow(fields) {
  fetch(`/api/follows/${fields.followee}`, {method: 'DELETE'}).then(showResponse).catch(showResponse);
}

function countFollowers(fields) {
  fetch(`/api/follows/count/${fields.followee}`).then(showResponse).catch(showResponse);
}

function getFollowingFreets(fields) {
  fetch('/api/follows/freets').then(showResponse).catch(showResponse);
}
