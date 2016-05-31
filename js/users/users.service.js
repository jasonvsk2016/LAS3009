(function () {
    'use strict';
 
    angular
        .module('json-server-users')
        .factory('UserService', UserService);
 
    UserService.$inject = ['$http', '$q', 'USERS_ENDPOINT'];
    function UserService($http, $q, USERS_ENDPOINT) {

        var service = {};
 
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
 
        return service;
 
        function GetAll() {

            var dfr = $q.defer();

            $http.get(USERS_ENDPOINT).then(
                function(users){
                    dfr.resolve(users.data);
                },
                function(){
                    dfr.reject({ message: 'Error getting all users' });
                }
            );

            return dfr.promise;
        }
 
        function GetById(id) {

            var dfr = $q.defer();
            
            $http.get(USERS_ENDPOINT + '/' + id).then(
                function(users){
                    dfr.resolve(users.data);
                },
                function(){
                    dfr.reject({ message: 'Error getting user by id' });
                }
            );
        
            return dfr.promise;
        }
 
        function GetByUsername(username) {

            var dfr = $q.defer();
            
            $http.get(USERS_ENDPOINT + '?username=' + username).then(
                function(users){
                    if(users.data.length){
                        dfr.resolve(users.data[0]);
                    } else {
                        dfr.reject({ message: 'Error getting user by username' });
                    }
                },
                function(){
                    dfr.reject({ message: 'Error getting user by username' });
                }
            );

            return dfr.promise;
        }
 
        function Create(user) {

            var dfr = $q.defer();
            
            $http.post(USERS_ENDPOINT, user).then(
                function(user){
                    dfr.resolve(user.data);
                },
                function(){
                    dfr.reject({ message: 'Error creating user' });
                }
            );

            return dfr.promise;
        }
 
        function Update(user) {

            var dfr = $q.defer();
            
            $http.put(USERS_ENDPOINT + '/' + user.id, user).then(
                function(user){
                    dfr.resolve(user.data);
                },
                function(){
                    dfr.reject({ message: 'Error updating user' });
                }
            );

            return dfr.promise;
        }
 
        function Delete(id) {
            
            var dfr = $q.defer();
            
            $http.delete(USERS_ENDPOINT + '/' + id).then(
                function(){
                    dfr.resolve();
                },
                function(){
                    dfr.reject({ message: 'Error deleting user' });
                }
            );

            return dfr.promise;
        }
    }
 
})();