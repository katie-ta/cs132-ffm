var app = angular.module('sensoryapps', ['ngRoute', 'ngMap']);

app.config(function($routeProvider) { // always listening for url change
  // document.body.innerHTML = '';
  $routeProvider
  .when("/", { // if url is '/', use home.html as template
    templateUrl: "home.html",
    controller: "homeController"
  })
  .when("/home", { // if url is '/home', use hoome.html as template
    templateUrl: "home.html",
    controller: "homeController"
  })
  .when("/about", { // if url is '/room/:room_id', use room.html as template
    templateUrl: "about.html",
    controller: "aboutController"
  })
  .when("/posts", { // if url is '/room/:room_id', use room.html as template
    templateUrl: "posts.html",
    controller: "postsController"
  })
});
