app.controller('adminCategoryController', ['$http', '$scope', 'ngDialog', function ($http, $scope, ngDialog) {
    $scope.editMode = false;

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

    $scope.add = function () {
        $scope.editRecord = {};
        ngDialog.open({
            template: 'templates\\BackOffice\\editCategory.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.cancel = function () {
        $scope.editRecord = {};
        ngDialog.closeAll();
    };

    $scope.save = function () {
        if (!$scope.editRecord.name)
        {
            $scope.errorMessage = "Please enter a valid name!";
            return;
        }
        if (!$scope.editRecord.description)
        {
            $scope.errorMessage = "Please enter a valid description!";
            return;
        }
        if (_.filter($scope.Categories, function (category) {
                return category.name == $scope.editRecord.name && category.id != $scope.editRecord.id;
            }).length > 0) {
            $scope.errorMessage = $scope.editRecord.name + " already exists!";
        } else {
            $http({
                method: 'Post',
                url: root + '/Categories',
                data: $scope.editRecord,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                function (response) {
                    //remove old element
                    _.reject($scope.Categories, function(category){ return category.id === $scope.editRecord.id; });
                    $scope.Categories.push($scope.editRecord);
                    ngDialog.closeAll();
                },
                function (errorResponse) {
                    // Do something
                }
            );
        }
    };

    $scope.edit = function (id) {
        for (var i = $scope.Categories.length - 1; i >= 0; i--) {
            if ($scope.Categories[i].id === id) {
                $scope.openDlg = ngDialog.open({
                    template: 'templates\\BackOffice\\editCategory.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
                $scope.editRecord = angular.copy($scope.Categories[i]);
            }
        }
    };

    $scope.delete = function (id) {
        for (var i = $scope.Categories.length - 1; i >= 0; i--) {
            if ($scope.Categories[i].id == id) {
                var index = i;
                $http({
                    method: 'Delete',
                    url: root + '/Categories/' + id,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function (response) {

                        $scope.Categories.splice(index, 1);

                    },
                    function (errorResponse) {
                        // Do something
                    }
                );
            }
        }
    };

}]);

app.controller('adminProductController', ['$http', '$scope', 'ngDialog', 'adminService', 'Upload', 'cloudinary',

    function ($http, $scope, ngDialog, adminService, $upload, cloudinary) {
        $scope.editMode = false;
        $scope.Categories = null;

        $http({
            method: 'GET',
            url: root + '/Products',
            //data: {},
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            function (response) {
                $scope.Products = response.data;
            },
            function (errorResponse) {
                // Do something
            }
        );

        $scope.ShowEditDialog = function () {
            adminService.GetCategories().then(function (categories) {
                $scope.Categories = categories;
                ngDialog.open({
                    template: 'templates/BackOffice/editProduct.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            });

        };

        $scope.add = function () {
            $scope.editRecord = {};
            $scope.ShowEditDialog();
        };

        $scope.cancel = function () {
            $scope.editRecord = {};
            ngDialog.closeAll();
        };

        $scope.save = function () {
            if (!$scope.editRecord.name)
            {
                $scope.errorMessage = "Please enter a valid name!";
                return;
            }
            if (!$scope.editRecord.description)
            {
                $scope.errorMessage = "Please enter a valid description!";
                return;
            }
            if (_.filter($scope.Products, function (product) {
                    return product.name == $scope.editRecord.name && product.id != $scope.editRecord.id;
                }).length > 0) {
                $scope.errorMessage = $scope.editRecord.name + " already exists!";
            } else {
                $scope.editRecord.categoryName = _.filter($scope.Categories, function(category){
                    return category.id === $scope.editRecord.categoryID; })[0].name;
                $http({
                    method: 'Post',
                    url: root + '/Products',
                    data: $scope.editRecord,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function (response) {
                        _.reject($scope.Products, function(product){ return product.id === $scope.editRecord.id; });
                        $scope.Products.push($scope.editRecord);
                        ngDialog.closeAll();
                    },
                    function (errorResponse) {
                        // Do something
                    }
                );
            }
        };

        $scope.edit = function (id) {
            for (var i = $scope.Products.length - 1; i >= 0; i--) {
                if ($scope.Products[i].id === id) {
                    $scope.editRecord = angular.copy($scope.Products[i]);
                    $scope.ShowEditDialog();
                }
            }
        };

        $scope.delete = function (id) {
            for (var i = $scope.Products.length - 1; i >= 0; i--) {
                if ($scope.Products[i].id == id) {
                    var index = i;
                    $http({
                        method: 'Delete',
                        url: root + '/Products/' + id,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(
                        function (response) {
                            $scope.Products.splice(index, 1);
                        },
                        function (errorResponse) {
                            // Do something
                        }
                    );
                }
            }
        };

        $scope.uploadFiles = function (files) {
            $scope.files = files;
            if (!$scope.files) return;
            angular.forEach(files, function (file) {
                if (file && !file.$error) {
                    file.upload = $upload.upload({
                        url: "https://api.cloudinary.com/v1_1/" + cloudinary.config().cloud_name + "/upload",
                        data: {
                            upload_preset: cloudinary.config().upload_preset,
                            tags: 'myphotoalbum',
                            context: 'photo=' + $scope.title,
                            file: file
                        }
                    }).progress(function (e) {
                        file.progress = Math.round((e.loaded * 100.0) / e.total);
                        file.status = "Uploading... " + file.progress + "%";
                    }).success(function (data, status, headers, config) {
                        // $rootScope.photos = $rootScope.photos || [];
                        data.context = {custom: {photo: $scope.title}};
                        file.result = data;
                        $scope.editRecord.imageURL = data.url;
                        // $rootScope.photos.push(data);
                    }).error(function (data, status, headers, config) {
                        file.result = data;
                    });
                }
            });
        };
        //});

        /* Modify the look and fill of the dropzone when files are being dragged over it */
        $scope.dragOverClass = function ($event) {
            var items = $event.dataTransfer.items;
            var hasFile = false;
            if (items != null) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].kind == 'file') {
                        hasFile = true;
                        break;
                    }
                }
            } else {
                hasFile = true;
            }
            return hasFile ? "dragover" : "dragover-err";
        };

    }]);

app.controller('TabsCtrl', ['$scope', function ($scope) {
    $scope.tabs = [{
        title: 'Categories',
        url: 'templates\\BackOffice\\categoryList.html'
    }, {
        title: 'Products',
        url: 'templates\\BackOffice\\productList.html'
    }];

    $scope.currentTab = $scope.tabs[0].url;

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }

    $scope.isActiveTab = function (tabUrl) {
        return tabUrl == $scope.currentTab;
    }

}]);