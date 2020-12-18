angular
  .module("login", [])

  .controller("loginController", () => {
    var vm = this;

    vm.username = "";
    vm.password = "";
  });
