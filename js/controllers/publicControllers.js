app.controller('menuController', ['$http', '$scope', 'productService', 'ngDialog', function ($http, $scope, productService, ngDialog) {

    productService.GetCategories().then(function (categories) {
        $scope.Categories = categories;
    });

    $scope.SearchPhrase = function () {
        if ($scope.searchPhrase) {
            productService.prepForBroadcast($scope.searchPhrase);
        }

    }

    $scope.ShowLogin = function () {
        ngDialog.open({template: 'templates/login.html', className: 'ngdialog-theme-default', scope: $scope});
    }

}]);

app.controller('productController', ['$http', '$scope', 'productService', function ($http, $scope, productService) {

    $scope.sizes = [6, 12, 24];

    if (!$scope.pagesize) {
        $scope.pagesize = $scope.sizes[0];
    }
    $scope.pageNumbers = [];
    $scope.searchPhrase = null;
    $scope.AllProducts = [];

    $scope.sortModes = productService.GetSortModes();
    $scope.SortMode = $scope.sortModes[0];

    productService.GetProducts($scope.category).then(function (products) {
        $scope.AllProducts = products;
        if ($scope.showpaging=='false')
        {
            $scope.AllProducts = _.sample(products,3);
        }
        showFirstPage();
    });

    $scope.SortProducts = function () {
        $scope.AllProducts = productService.SortProducts($scope.SortMode);
        showFirstPage();
    }

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

}]);

app.controller('productDetailsController', ['$http', '$scope', '$routeParams', 'productService',
    function ($http, $scope, $routeParams, productService) {

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
            },
            function (errorResponse) {
                // Do something
            }
        );

    }]
);
app.controller('categoryController', ['$http', '$scope', '$routeParams', 'productService',
    function ($http, $scope, $routeParams, productService) {

        $scope.category = $routeParams.param;
        productService.GetCategoryName($scope.category).then(function (name) {
            $scope.categoryName = name;
        });
        $scope.showPaging = 1;
    }]);

app.controller('loginController', ['$window', '$http', '$scope', '$routeParams', 'productService', 'AuthenticationService',
    function ($window, $http, $scope, $routeParams, productService, AuthenticationService) {

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