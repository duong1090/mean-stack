angular
  .module("authService", [])

  .factory("Auth", ($http, $q, AuthToken) => {
    //create auth factory object
    var authFactory = {};

    //log a user in
    authFactory.login = (username, password) => {
      //return the promise object and its data
      return $http
        .post("/api/authenticate", {
          username: username,
          password: password,
        })
        .then((data) => {
          AuthToken.setToken(data.token);
          return data;
        });
    };

    //log a user out by clearing the token
    authFactory.logout = () => {
      //clear the token
      AuthToken.setToken();
    };

    // check if a user is logged in
    // check if there is a local token
    authFactory.isLoggedIn = () => {
      if (AuthToken.getToken()) return true;
      else return false;
    };

    // get the logger in user
    authFactory.getUser = () => {
      if (AuthToken.getToken()) return $http.get("/api/me", { cache: true });
      else return $q.reject({ message: "User has no token" });
    };

    authFactory.createSampleUser = () => {
      $http.post("/api/sample");
    };

    return authFactory;
  })

  .factory("AuthToken", ($window) => {
    var authTokenFactory = {};
    // get the token out of local storage
    authTokenFactory.getToken = () => {
      return $window.localStorage.getItem("token");
    };

    authTokenFactory.setToken = (token) => {
      if (token) $window.localStorage.setItem("token", token);
      else $window.localStorage.removeItem("token");
    };
  })

  .factory("AuthInterceptor", ($q, $location, AuthToken) => {
    var interceptorFactory = {};

    // this will happen on all HTTP requests
    interceptorFactory.request = (config) => {
      //grab the token
      var token = AuthToken.getToken();

      //if the token exists, add it to the header as x-access-origin
      if (token) config.header["x-access-token"] = token;

      return config;
    };

    //hanppens on response errors
    interceptorFactory.responseError = (response) => {
      //if our server returns a 403 forbidden response
      if (response.status == 403) {
        AuthToken.setToken();
        $location.path("/login");
      }
      //return the errors from the server as a promise
      return $q.reject(response);
    };

    return interceptorFactory;
  });
