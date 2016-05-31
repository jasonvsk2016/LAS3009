app.service('adminService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

    var self = this;
    this.GetCategories = function () {
        var self = this;
        this.categories = [];

        var defer = $q.defer();
        if (self.products) {
            defer.resolve(self.categories);
        }
        else {
            $http({
                method: 'GET',
                url: root + '/Categories',
                //data: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                function (response) {
                    self.categories = response.data;
                    defer.resolve(self.categories);
                },
                function (errorResponse) {
                    defer.reject('oops');
                }
            );
        }
        return defer.promise;
    }
}]);

