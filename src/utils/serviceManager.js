const setSession = (email, password) => {
  return fetch('/api/session', { method: 'POST', body: new URLSearchParams(`email=${email}&password=${password}`) })
    .catch(function (error) { console.log('setSession error:', error)})
    .then(response => response);
}

const getDeviceByUserId = (id) => {
  return fetch('/api/devices?userId=' + id, { method: 'GET' })
    .catch(function (error) { console.log('setDevices error:', error)})
    .then(response => response);
}

export {
  setSession,
  getDeviceByUserId,
};
