function startBreak(fields) {
  fetch('/api/takebreaks/start', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}}).then(showResponse).catch(showResponse);
}

function endBreak(fields) {
  fetch('/api/takebreaks/end', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}}).then(showResponse).catch(showResponse);
}
