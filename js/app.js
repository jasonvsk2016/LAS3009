    var sortMode = {
        nameAsc: 1,
        nameDesc: 2,
        priceAsc: 3,
        priceDesc: 4
    }

    var app = angular.module('store', ['ngRoute', 'json-server-auth', 'json-server-users','ngDialog',
        'ngResource', 'ngFileUpload', 'cloudinary','ui.bootstrap', 'angular-confirm']);

    var root = 'http://localhost:3000';






