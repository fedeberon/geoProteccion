const setSession = (email, password) => {
  return fetch("api/session", {
    method: "POST",
    body: new URLSearchParams(`email=${email}&password=${password}`),
  })
    .catch(function (error) {
      console.log("setSession error:", error);
    })
    .then((response) => response);
};

const setUser = (name, email, password) => {
  return fetch(`api/users`, {
    method: "POST",
    body: new URLSearchParams(
      `name=${name}&email=${email}&password=${password}`
    ),
  })
    .catch(function (error) {
      console.log("setUser error: ", error);
    })
    .then((response) => response);
};

const getDeviceByUserId = (id) => {
  return fetch(`api/devices?userId=${id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setDevices error: ", error);
    })
    .then((response) => response.json());
};

const getStatistics = (from, to) => {
  let time = new Date();
  return fetch(`api/statistics?from=${from}T00%3A00%3A00.000Z&to=${to}T${time.getHours()<10 ? `0${time.getHours()}` : time.getHours()}%3A${time.getMinutes()<10 ? `0${time.getMinutes()}` : time.getMinutes()}%3A00.000Z`,{ method: 'GET' })
    .catch(function (error) { console.log('setStatistics error: ', error)})
    .then(response => response.json());
}

const getGeozonesByUserId = (id) => {
  return fetch(`api/geofences?userId=${id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setGeofences error: ", error);
    })
    .then((response) => response.json());
};

const getGeozonesByDeviceId = (deviceId) => {
  return fetch(`api/geofences?deviceId=${deviceId}`, {method: 'GET'})
    .catch(function (error) {console.log('setGeofencesByDeviceIderror: ' + error)})
    .then(response => response.json());
}

const getGeozonesByGroupId = (groupId) => {
  return fetch(`api/geofences?groupId=${groupId}`, {method: 'GET'})
    .catch(function (error) {console.log('setGeofencesByGroupIderror: ' + error)})
    .then(response => response.json());
}

const getNotificationsByUserId = (id) => {
  return fetch(`api/notifications?userId=${id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setNotifications error: ", error);
    })
    .then((response) => response.json());
};

const getNotificationsByDeviceId = (id) => {
  return fetch(`api/notifications?deviceId=${id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setNotifications error: ", error);
    })
    .then((response) => response.json());
};

const getNotificationsByGroupId = (id) => {
  return fetch(`api/notifications?groupId=${id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setNotifications error: ", error);
    })
    .then((response) => response.json());
};

const getAvailableTypes = () => {
  return fetch(`api/notifications/types`, { method: "GET" })
    .catch(function (error) {
      console.log("setAvailableTypes error: ", error);
    })
    .then((response) => response.json());
};

const getRoutesReports = (from, to, params = "", groups = "") => {
  return fetch(`api/reports/route?` + `${params}${groups}from=${from}:00.000Z&to=${to}:00.000Z`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  })
    .catch(function (error) {
      console.log("setRoutesReports error: ", error);
    })
    .then((response) => response.json());
};

const getEventsReports = (from, to, params = "", types = "") => {
  return fetch(`api/reports/events?` + `${params}${types}from=${from}:00.000Z&to=${to}:00.000Z`,
    { method: "GET", headers: { "Accept": "application/json" } }
  )
    .catch(function (error) {
      console.log("setEventsReports error: ", error);
    })
    .then((response) => response.json());
};

const getPositionsByDeviceId = (id, from, to) => {
  return fetch(`api/positions?` + `deviceId=${id}&from=${from}&to=${to}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  })
    .catch(function (error) {
      console.log("setPositions error: ", error);
    })
    .then((response) => response.json());
};

const getPositionsReports = (ids) => {
  return fetch(`api/positions?` + `${ids}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  })
    .catch(function (error) {
      console.log("setPositions error: ", error);
    })
    .then((response) => response.json());
};

const getTripsReports = (from, to, params, type) => {
  return fetch(
    `api/reports/trips?` + `${params}` + `${type}` + `from=${from}&to=${to}`,
    { method: "GET", headers: { "Accept": "application/json" } }
  )
    .catch(function (error) {
      console.log("setTrips error: ", error);
    })
    .then((response) => response.json());
};

const getStopsReports = (from, to, params) => {
  return fetch(`api/reports/stops?` + `${params}` + `from=${from}&to=${to}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  })
    .catch(function (error) {
      console.log("setStops error: ", error);
    })
    .then((response) => response.json());
};

const getSummaryReports = (from, to, params) => {
  return fetch(`api/reports/summary?` + `${params}` + `from=${from}&to=${to}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  })
    .catch(function (error) {
      console.log("setSummary error: ", error);
    })
    .then((response) => response.json());
};

const getGraphicData = (from, to, params) => {
  return fetch(`api/reports/route?` + `${params}from=${from}&to=${to}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  })
    .catch(function (error) {
      console.log("setRoutesReports error: ", error);
    })
    .then((response) => response.json());
};

const getMaintenance = (id) => {
  if(id){
  return fetch(`api/maintenance?userId=${id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setMaintenance error: ", error);
    })
    .then((response) => response.json());
  } else {
    return fetch(`api/maintenance`, { method: "GET" })
    .catch(function (error) {
      console.log("setMaintenance error: ", error);
    })
    .then((response) => response.json());
  }
};

const getCurrentAddress = (lat = -32.882297, lng = -68.815419) => {
  return fetch(`api/server/geocode?latitude=${lat}&longitude=${lng}`, {
    method: "GET",
  })
    .catch(function (error) {
      console.log("setCurrentAddress error: ", error);
    })
    .then((response) => response.text());
};

const getCommandTypes = (id) => {
  return fetch(`api/commands/types?deviceId=${id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setCommandTypes error: ", error);
    })
    .then((response) => response.json());
};

const getServer = () => {
  return fetch(`api/server`, { method: "GET" })
    .catch(function (error) {
      console.log("getServer error: ", error);
    })
    .then((response) => response.json());
};

const getComputedAttributesByDeviceId = (deviceId) => {
  return fetch(`api/attributes/computed?deviceId=${deviceId}`, {
    method: "GET",
  })
    .catch(function (error) {
      console.log("getComputedAttributesById error: ", error);
    })
    .then((response) => response.json());
};

const getComputedAttributesByGroupId = (groupId) => {
  return fetch(`api/attributes/computed?groupId=${groupId}`, {
    method: "GET",
  })
    .catch(function (error) {
      console.log("getComputedAttributesById error: ", error);
    })
    .then((response) => response.json());
};

const getComputedAttributes = () => {
  return fetch(`api/attributes/computed`, { method: "GET" })
    .catch(function (error) {
      console.log("getComputedAttributes error: ", error);
    })
    .then((response) => response.json());
};

const removeComputedAttribute = (id) => {
  return fetch(`api/attributes/computed/${id}`, {method: "DELETE"})
    .catch(function (error) {
      console.log("removeComputedAttributes error: ", error);
    })
    .then((response) => response.json());
}

const getCommandsByDeviceId = (deviceId) => {
  return fetch(`api/commands?deviceId=${deviceId}`, { method: "GET" })
    .catch(function (error) {
      console.log("setCommands error: ", error);
    })
    .then((response) => response.json());
};

const getGroups = () => {
  return fetch(`api/groups`, { method: "GET" })
    .catch(function (error) {
      console.log("getGroups error: ", error);
    })
    .then((response) => response.json());
};

const getCalendarsByUserId = (userId) => {
  return fetch(`api/calendars?userId=${userId}`, { method: "GET" })
    .catch(function (error) {
      console.log("setCalendars error: ", error);
    })
    .then((response) => response.json());
};

const updateServer = (server) => {
  return fetch(`api/server`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(server),
  })
    .catch(function (error) {
      console.log("setCalendars error: ", error);
    })
    .then((response) => response.json());
};

const updateUser = (id, data) => {
  return fetch(`api/users/${id}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  }).catch(function (error) {
    console.log("updateUser error: ", error);
  }).then((response) => response.json());
};

const getCommands = () => {
  return fetch(`api/commands`, { method: "GET" })
    .catch(function (error) {
      console.log("setCommands error: ", error);
    })
    .then((response) => response.json());
};

export {
  setSession,
  getDeviceByUserId,
  getGeozonesByUserId,
  getNotificationsByUserId,
  getNotificationsByDeviceId,
  getAvailableTypes,
  getRoutesReports,
  getEventsReports,
  getPositionsByDeviceId,
  getPositionsReports,
  getTripsReports,
  getStopsReports,
  getSummaryReports,
  getGraphicData,
  setUser,
  getMaintenance,
  getCurrentAddress,
  getServer,
  getCommandTypes,
  getComputedAttributesByDeviceId,
  getComputedAttributes,
  getCommandsByDeviceId,
  getGroups,
  getCalendarsByUserId,
  getStatistics,
  updateServer,
  getCommands,
  getGeozonesByDeviceId,
  updateUser,
  getGeozonesByGroupId,
  getNotificationsByGroupId,
  getComputedAttributesByGroupId,
  removeComputedAttribute
};
