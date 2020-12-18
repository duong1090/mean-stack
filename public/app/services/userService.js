angular.module("userService", []).factory("User", ($http) => {
  //create a new object
  var userFactory = {};

  //get a single user
  userFactory.get = (id) => {
    return $http.get("/api/user/");
  };

  // get all users
  userFactory.all = () => {
    return $http.get("/api/users/");
  };

  // create a user
  userFactory.create = (userData) => {
    return $http.post("/api/users/", userData);
  };

  // update a user
  userFactory.update = (id, userData) => {
    return $http.put("/api/users/" + id, userData);
  };

  // delete a user
  userFactory.delete = (id) => {
    return $http.delete("/api/users/" + id);
  };

  // return our entire userFactory object
  return userFactory;
});
