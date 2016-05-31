
app.service('mySharedService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
    var self = this;
    this.message = '';
    this.CategoryChosen = '';
    this.sortModes = [{id: sortMode.nameAsc, name: 'Name [A -> Z]'},
        {id: sortMode.nameDesc, name: 'Name [Z -> A]'},
        {id: sortMode.priceAsc, name: 'Price Ascending'},
        {id: sortMode.priceDesc, name: 'Price Descending'}];
    this.SortMode = this.sortModes[0];
    this.products = [];

    this.sortBy = function (condition) {
        //return this.products.SortedBy...
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
                    self.SortProducts();
                    if (category) {
                        defer.resolve(self.AllProductsInDB.filter(function (product) {
                            return product.CategoryID == category;
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

    this.SortProducts = function () {
        if (this.CategoryChosen) {
            this.products = this.AllProductsInDB.filter(function (product) {
                return product.CategoryID == self.CategoryChosen;
            });
        }
        switch (this.SortMode.id) {
            case  sortMode.nameAsc :
            {
                this.products.sort(function (a, b) {
                    return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0);
                });
            }
                break;
            case    sortMode.nameDesc :
            {
                this.products.sort(function (a, b) {
                    return (b.Name > a.Name) ? 1 : ((a.Name > b.Name) ? -1 : 0);
                });
            }
                break;
            case   sortMode.priceAsc :
            {
                this.products.sort(function (a, b) {
                    return (a.Price > b.Price) ? 1 : ((b.Price > a.Price) ? -1 : 0);
                });
            }
                break;
            case  sortMode.priceDesc :
            {
                this.products.sort(function (a, b) {
                    return (b.Price > a.Price) ? 1 : ((a.Price > b.Price) ? -1 : 0);
                });
                ;
            }
                break;
        }
        //  showFirstPage();
    };
    /*
     sharedService.prepForBroadcast = function(msg) {
     this.message = msg;
     this.broadcastItem();
     };

     sharedService.broadcastItem = function() {
     $rootScope.$broadcast('handleBroadcast');
     };

     sharedService.prepForBroadcastCategory = function(categoryID) {
     this.CategoryID = categoryID;
     this.broadcastCategory();
     };

     sharedService.broadcastCategory = function() {
     $rootScope.$broadcast('handleBroadcastCategory');
     };
     */
}]);