const setSession = (email, password) => {
  return fetch('/api/session', { method: 'POST', body: new URLSearchParams(`email=${email}&password=${password}`) })
    .catch(function (error) { console.log('setSession error:', error)})
    .then(response => response);
}

export {
  setSession,
};
