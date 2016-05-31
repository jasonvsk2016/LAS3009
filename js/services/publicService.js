app.service('productService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

    var self = this;

    this.message = '';

    this.CategoryChosen = '';

    this.sortModes = [{id: eSortMode.nameAsc, name: 'Name [A -> Z]'},
        {id: eSortMode.nameDesc, name: 'Name [Z -> A]'},
        {id: eSortMode.priceAsc, name: 'Price Ascending'},
        {id: eSortMode.priceDesc, name: 'Price Descending'}];
    this.SortMode = this.sortModes[0];
    this.products = [];

    this.GetCategories = function () {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: root + '/Categories',
            //data: {},
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            function (response) {
                self.Categories = response.data;
                defer.resolve(self.Categories);
            },
            function (errorResponse) {
                defer.reject('oops');
            }
        );
        return defer.promise;
    };

    this.GetCategoryName = function (categoryID) {
        var defer = $q.defer();
        if (self.Categories) {
            defer.resolve(_.find(self.Categories, function (category) {
                return category.id == categoryID
            }).name);
        } else {
            self.GetCategories().then(function (categories) {
                defer.resolve(_.find(self.Categories, function (category) {
                    return category.id == categoryID
                }).name);
            });
        }
        return defer.promise;
    }

    this.GetSortModes = function () {
        return this.sortModes;
    }

    this.GetProducts = function (category) {
        var defer = $q.defer();
        if (category && self.AllProductsInDB) {
            defer.resolve(self.AllProductsInDB.filter(function (product) {
                return product.categoryID == category;
            }));
        } else {
            $http({
                method: 'GET',
                url: root + '/Products',
                //data: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                function (response) {

                    self.products = response.data;
                    //Loop and push instead
                    self.AllProductsInDB = self.products.slice(0, self.products.length);
                    self.SortProducts(self.SortMode);
                    if (category) {
                        defer.resolve(self.AllProductsInDB.filter(function (product) {
                            return product.categoryID == category;
                        }));
                    } else {
                        defer.resolve(self.products);
                    }
                },
                function (errorResponse) {
                    defer.reject('oops');
                }
            );
        }
        return defer.promise;
    }

    this.SortProducts = function (sortMode) {
        this.SortMode = sortMode;
        if (this.CategoryChosen) {
            this.products = this.AllProductsInDB.filter(function (product) {
                return product.CategoryID == self.CategoryChosen;
            });
        }
        switch (sortMode.id) {
            case  eSortMode.nameAsc :
            {
                this.products = _.sortBy(this.products, 'name');
            }
                break;
            case    eSortMode.nameDesc :
            {
                this.products = _.sortBy(this.products, 'name').reverse();
            }
                break;
            case   eSortMode.priceAsc :
            {
                this.products = _.sortBy(this.products, 'price');
            }
                break;
            case  eSortMode.priceDesc :
            {
                this.products = _.sortBy(this.products, 'price').reverse();
            }
                break;
        }
        return this.products;
    };
}]);