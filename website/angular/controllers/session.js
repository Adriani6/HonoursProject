index.factory('Session', function($http) {
  var Session = {
    data: {},
    saveSession: function() { /* save session data to db */ },
    updateSession: function() { 
      /* load data from db */
      $http.get('/api/session/json').then(function(r) { return Session.data = r.data;});
    }
  };
  Session.updateSession();
  return Session; 
});