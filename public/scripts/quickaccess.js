/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/object-curly-spacing */
function getQuickAccess(fields) {
  fetch('/api/quickaccess')
    .then(showResponse)
    .catch(showResponse);
}

function editQuickAccess(fields) {
  const entries = fields.entries.split('\n').map(x => x.trim()).filter(x => x).map(x => {
    return { name: x.split(",")[0].trim(), url: x.split(",")[1].trim() };
  });
  console.log(entries);
  fetch('/api/quickaccess', {method: 'PUT', body: JSON.stringify({entries}), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
