/* eslint-disable @typescript-eslint/restrict-template-expressions */

function getComments(fields) {
  fetch(`/api/comments?${fields.freetId ? `&freetId=${fields.freetId}` : ''}${fields.author ? `&author=${fields.author}` : ''}`)
    .then(showResponse)
    .catch(showResponse);
}

function createComment(fields) {
  if (fields.replyTo === 'comment') {
    fetch(`/api/comments/oncomment/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  } else {
    fetch(`/api/comments/onfreet/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
}

function editComment(fields) {
  fetch(`/api/comments/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteComment(fields) {
  fetch(`/api/comments/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
