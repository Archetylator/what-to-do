export const LocalAPI = {};

Object.defineProperty(LocalAPI, 'settings', {
  get: function() { 
    return JSON.parse(localStorage.getItem('localsettings')) || ''
  },
  set: function(val) { 
    localStorage.setItem('localsettings', JSON.stringify(val)) 
  }
});