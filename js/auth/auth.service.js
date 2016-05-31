(function () {
    'use strict';
 
    angular
        .module('json-server-auth', ['json-server-users', 'ngCookies'])
        .factory('AuthenticationService', AuthenticationService);
 
    AuthenticationService.$inject = ['$q', '$http', '$cookieStore', '$rootScope', '$timeout', 'UserService'];
    function AuthenticationService($q, $http, $cookieStore, $rootScope, $timeout, UserService) {

        var service = {};
 
        service.Login = Login;
        service.isLoggedIn = isLoggedIn;
        service.getCurrentUser = getCurrentUser;
        service.Logout = Logout;
 
        return service;
 
        function Login(username, password) {

            var dfr = $q.defer();

            UserService
                .GetByUsername(username)
                .then(
                    function (user) {
                        if (user !== null && user.password === password) {
                            $cookieStore.put('user', user);
                            dfr.resolve(user);
                        } else {
                            dfr.reject({ message: 'Username or password is incorrect' });
                        }
                    },
                    function(error){
                        dfr.reject(error);
                    });

            return dfr.promise;
 
        }

        function isLoggedIn(){
            return $cookieStore.get('user') !== undefined;
        }

        function getCurrentUser(){
            return $cookieStore.get('user');
        }
 
        function Logout() {

            var dfr = $q.defer();
            
            $cookieStore.remove('user');
            
            dfr.resolve();
            
            return dfr.promise;
        }
    }
 
})();