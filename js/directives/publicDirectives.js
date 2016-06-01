app.directive('productList', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates\\public\\product-list.html',
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
        templateUrl: 'templates\\public\\menu.html',
        controller: 'menuController',
    }
});

app.directive('productThumb', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates\\public\\product-thumb.html'
    }
});