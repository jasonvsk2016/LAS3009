app.controller('menuController', ['$http', '$scope', 'mySharedService', 'ngDialog', function ($http, $scope, sharedService, ngDialog) {
    $http({
        method: 'GET',
        url: root + '/Categories',
        //data: {},
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(
        function (response) {
            $scope.Categories = response.data;
        },
        function (errorResponse) {
            // Do something
        }
    );

    $scope.SearchPhrase = function () {
        if ($scope.searchPhrase) {
            sharedService.prepForBroadcast($scope.searchPhrase);
        }

    }

    $scope.ShowLogin = function () {
        ngDialog.open({template: 'templates/login.html', className: 'ngdialog-theme-default', scope: $scope});
    }

}]);

app.controller('productController', ['$http', '$scope', 'mySharedService', function ($http, $scope, mySharedService) {
    $scope.sizes = [6, 12, 24];
    if (!$scope.pagesize) {
        $scope.pagesize = $scope.sizes[0];
    }
    $scope.pageNumbers = [];
    $scope.searchPhrase = null;
    $scope.AllProducts = [];


    mySharedService.GetProducts($scope.category).then(function (products) {
        $scope.AllProducts = products;
        showFirstPage();
    });

    $scope.updatePageSize = function () {
        showFirstPage(this);

    };

    $scope.ShowPage = function (no) {
        $scope.StartIndex = ((no - 1) * $scope.pagesize) + 1;
        $scope.EndIndex = $scope.StartIndex + $scope.pagesize - 1;
        if ($scope.AllProducts.length < $scope.EndIndex) {
            $scope.EndIndex = $scope.AllProducts.length;
        }
        $scope.CurrentPage = no;
        $scope.CurrentProducts = $scope.AllProducts.slice($scope.StartIndex - 1, $scope.EndIndex);
    };


    function showFirstPage() {

        if ($scope.AllProducts) {
            if ($scope.AllProducts.length < $scope.pagesize) {
                $scope.EndIndex = $scope.AllProducts.length;
            } else {
                $scope.EndIndex = $scope.pagesize;
            }
            $scope.CurrentProducts = $scope.AllProducts.slice(0, $scope.EndIndex);
            //$scope.CurrentProducts = productService.getByCategory(1, 1);
            $scope.CurrentPage = 1;
            $scope.StartIndex = 1;
            updatepageNumbers();
        }
    }

    function updatepageNumbers() {
        var i = 0;
        $scope.pageNumbers = [];
        if ($scope.AllProducts) {
            do {
                i++;
                $scope.pageNumbers.push(i);
            } while (i * $scope.pagesize < $scope.AllProducts.length)
        }
    }

    $scope.$on('handleBroadcast', function () {

        $scope.AllProducts = mySharedService.AllProductsInDB.filter(function (product) {
            return product.Name.search(mySharedService.message) > -1;
        });
        $scope.SortProducts();
    });

    $scope.$on('handleBroadcastCategory', function () {
        $scope.CategoryChosen = mySharedService.CategoryID;
        if ($scope.AllProductsInDB) {
            $scope.SortProducts();
        }
    });

}]);

app.controller('productDetailsController', ['$http', '$scope', '$routeParams', 'mySharedService',
    function ($http, $scope, $routeParams, sharedService) {

        $http({
            method: 'GET',
            url: root + '/Products/' + $routeParams.param,
            //data: {},
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            function (response) {
                $scope.ProductDetails = response.data;

                //we get the similar items by category
                if ($scope.AllProductsInDB) {
                    $scope.SimilarItems = $scope.AllProductsInDB.filter(function (product) {
                        return product.CategoryID == $scope.ProductDetails.CategoryID;
                    });

                }

            },
            function (errorResponse) {
                // Do something
            }
        );

    }]
);
app.controller('categoryController', ['$http', '$scope', '$routeParams', 'mySharedService',
    function ($http, $scope, $routeParams, sharedService) {

        $scope.category = $routeParams.param;
        $scope.showPaging = 1;
    }]);

app.controller('loginController', ['$window', '$http', '$scope', '$routeParams', 'mySharedService', 'AuthenticationService',
    function ($window, $http, $scope, $routeParams, sharedService, AuthenticationService) {

        $scope.AuthParams = {};

        $scope.AuthenticatedUser = AuthenticationService.getCurrentUser();
        $scope.IsUserAuthenticated = AuthenticationService.isLoggedIn();
        $scope.DoLogin = function () {
            AuthenticationService.Login($scope.AuthParams.username, $scope.AuthParams.password).then(function () {
                //DO something
                $window.location.href = '/Admin';
            }, function (reason) {
                // rejection
                $scope.errorMessage = reason.message
            });
        }

        $scope.Logout = function () {
            AuthenticationService.Logout().then(function () {
                //DO something
                $window.location.href = '/';
            }, function (reason) {
                // rejection
                alert(reason.message);
            });
        }

    }]);