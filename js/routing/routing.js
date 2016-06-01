app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates\\public\\HomePage.html'
    }).when('/ProductDetails/:param', {
        controller: 'productDetailsController',
        templateUrl: 'templates\\public\\ProductDetails.html'
    }).when('/Category/:param', {
        controller: 'categoryController',
        templateUrl: 'templates\\public\\Category.html'
    }).when('/Admin', {
        templateUrl: 'templates\\BackOffice\\Admin.html',
    }).when('/Login', {
        templateUrl: 'templates\\public\\Login.html',
    }).otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({enabled: true});

}]);

app.run(['$rootScope', '$location', 'AuthenticationService', function ($rootScope, $location, AuthenticationService) {
    $rootScope.$on('$routeChangeStart', function (event) {
        if ( $location.$$path == '/Admin') {
            if (!AuthenticationService.isLoggedIn()) {
                $location.path('/Login');
            }
            else {
                $location.path('/Admin');
            }
        }
    });
}]);