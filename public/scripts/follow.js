/* eslint-disable @typescript-eslint/restrict-template-expressions */
function getFollowings(fields) {
  fetch('/api/follows').then(showResponse).catch(showResponse);
}

function follow(fields) {
  fetch('/api/follows/', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}}).then(showResponse).catch(showResponse);
}

function unfollow(fields) {
  fetch(`/api/follows?followee=${fields.followee}`, {method: 'DELETE'}).then(showResponse).catch(showResponse);
}

function countFollowers(fields) {
  fetch(`/api/follows/count?followee=${fields.followee}`).then(showResponse).catch(showResponse);
}
