const getSession = (email, password) => {
  return fetch('/api/session', { method: 'POST', body: new URLSearchParams(`email=${email}&password=${password}`) })
    .catch(function (error) { console.log('getSession error:', error)})
    .then(response => response);
}

const deleteSession = () => {
  return fetch('/api/session', { method: 'DELETE' })
    .catch(function (error) { console.log('deleteSession error:', error)})
    .then(response => response);
}

const deleteDialog = (deviceId) => {
  return fetch(`/api/devices/${deviceId}`, { method: 'DELETE' })
  .catch(function (error) { console.log('deleteDialog error:', error)})
  .then(response => response);
}

export {
  getSession,
  deleteSession,
  deleteDialog,
};
