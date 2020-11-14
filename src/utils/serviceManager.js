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
    .catch(function (error) { console.log('setAvailableTypes error: ', error)})
    .then(response => response.json());
}

const getRoutesReports = (from, to, params = '') => {
  return fetch(`api/reports/route?` + `${params}from=${from}&to=${to}`, { method: 'GET', headers: {'Accept': 'application/json'} })
    .catch(function (error) { console.log('setRoutesReports error: ', error)})
    .then(response => response.json());
}

const getEventsReports = (fromDev, toDev, typeDev, paramsDev = '') => {
  return fetch(`api/reports/events?` + `${paramsDev}` + `${typeDev}` + `from=${fromDev}&to=${toDev}`, { method: 'GET', headers: {'Accept': 'application/json'} })
    .catch(function (error) { console.log('setEventsReports error: ', error)})
    .then(response => response.json());
}

const getPositionsByDeviceId = (id, from, to) => {
  return fetch(`api/positions?` + `deviceId=${id}&from=${from}&to=${to}`, { method: 'GET', headers: { 'Accept': 'application/json'} })
    .catch(function (error) { console.log('setPositions error: ', error)})
    .then(response => response.json());
}

const getPositionsReports = (ids) => {
  return fetch(`api/positions?` + `${ids}`, { method: 'GET', headers: { 'Accept': 'application/json'} })
    .catch(function (error) { console.log('setPositions error: ', error)})
    .then(response => response.json());
}

const getTripsReports = (from, to, params, type) => {
  return fetch(`api/reports/trips?` + `${params}` + `${type}` + `from=${from}&to=${to}`, { method: 'GET', headers: {'Accept': 'application/json'} })
    .catch(function (error) { console.log('setTrips error: ', error)})
    .then(response => response.json());
}

const getStopsReports = (from, to, params) => {
  return fetch(`api/reports/stops?` + `${params}` + `from=${from}&to=${to}`, { method: 'GET', headers: {'Accept': 'application/json'} })
    .catch(function (error) { console.log('setStops error: ', error)})
    .then(response => response.json());
}

const getSummaryReports = (from, to, params) => {
  return fetch(`api/reports/summary?` + `${params}` + `from=${from}&to=${to}`, { method: 'GET', headers: {'Accept': 'application/json'} })
    .catch(function (error) { console.log('setSummary error: ', error)})
    .then(response => response.json());
}

export {
  setSession,
  getDeviceByUserId,
  getGeozonesByUserId,
  getNotificationsByUserId,
  getAvailableTypes,
  getRoutesReports,
  getEventsReports,
  getPositionsByDeviceId,
  getPositionsReports,
  getTripsReports,
  getStopsReports,
  getSummaryReports,
};
