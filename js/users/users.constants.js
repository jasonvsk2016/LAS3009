(function () {
    'use strict';
 
    angular
        .module('json-server-users')
        .constant('USERS_ENDPOINT', 'http://localhost:3000/users');
 
})();