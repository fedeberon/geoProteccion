const setSession = (email, password) => {
  return fetch('api/session',
    { method: 'POST', body: new URLSearchParams(`email=${email}&password=${password}`) })
    .catch(function (error) { console.log('setSession error:', error)})
    .then(response => response);
}

const getDeviceByUserId = (id) => {
  return fetch(`api/devices?userId=${id}`,{ method: 'GET' })
    .catch(function (error) { console.log('setDevices error: ', error)})
    .then(response => response.json());
}

const getGeozonesByUserId = (id) => {
  return fetch(`api/geofences?userId=${id}`,{method: 'GET'})
    .catch(function (error) { console.log('setGeofences error: ', error)})
    .then(response => response.json());
}

const getNotificationsByUserId = (id) => {
  return fetch(`api/notifications?userId=${id}`,{method: 'GET'})
    .catch(function (error) { console.log('setNotifications error: ', error)})
    .then(response => response.json());
}

const getAvailableTypes = () => {
  return fetch(`api/notifications/types`,{method: 'GET'})
    .catch(function (error) { console.log('setNotifications error: ', error)})
    .then(response => response.json());
}

const getRoutesReports = (from, to, params = '') => {
  return fetch(`api/reports/route?` + `${params}from=${from}&to=${to}`, { method: 'GET', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'} })
    .catch(function (error) { console.log('setNotifications error: ', error)})
    .then(response => response.json());
}

export {
  setSession,
  getDeviceByUserId,
  getGeozonesByUserId,
  getNotificationsByUserId,
  getAvailableTypes,
  getRoutesReports,
};
