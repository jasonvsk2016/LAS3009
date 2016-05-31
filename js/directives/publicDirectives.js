app.directive('productList', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates\\product-list.html',
        controller: 'productController',
        scope: {
            category: '=',
            showpaging: '@',
            pagesize: '@'
        }
    }
});

app.directive('categoryMenu', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates\\menu.html',
        controller: 'menuController',
    }
});

app.directive('productThumb', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates\\product-thumb.html'
    }
});