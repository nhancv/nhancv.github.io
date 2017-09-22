'use strict';
var app = angular.module('app', ['ngStorage', 'xeditable', 'ui.select', 'app.models', 'app.services', 'app.filters']);
app.config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
    uiSelectConfig.resetSearchInput = true;
    uiSelectConfig.appendToBody = true;
});
app.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});
app.controller('appController', function ($scope, $localStorage, $sessionStorage, $filter, sUtil, menu) {

    //@nhancv TODO: Toggle menu
    $scope.menuVisible = true;
    $scope.toggleMenu = function () {
        $scope.menuVisible = !$scope.menuVisible;
    };

    //@nhancv TODO: Prepare menu
    $scope.drinkItems = menu.sodo;
    $scope.getDrinkItemNames = function () {
        var arr = [];
        $scope.drinkItems.forEach(function (t) {
            arr.push(t.name);
        });
        return arr;
    };

    $scope.getDrinkItemPrice = function (name) {
        for (var i = 0; i < $scope.drinkItems.length; i++) {
            var t = $scope.drinkItems[i];
            if (t.name === name) {
                return t.price;
            }
        }
        return 20;
    };

    //@nhancv TODO: Handle update order list
    $scope.orderItems = [];
    $scope.onDrinkSelect = function (order, data) {
        order.drinkPrice = $scope.getDrinkItemPrice(data);
    };

    $scope.validateEmpty = function (data, id) {
        if (data === null || data === undefined) {
            return "Required"
        }
    };

    // filter orderItems to show
    $scope.filterOrder = function (order) {
        return order.isDeleted !== true;
    };

    // mark order as deleted
    $scope.deleteOrder = function (id) {
        var filtered = $filter('filter')($scope.orderItems, {id: id});
        if (filtered.length) {
            filtered[0].isDeleted = true;
        }
    };

    // add order
    $scope.addOrder = function () {
        $scope.orderItems.push({
            id: $scope.orderItems.length + 1,
            name: '',
            drinkName: null,
            drinkPrice: null,
            orderQuantity: 1,
            isNew: true
        });
    };

    // cancel all changes
    $scope.cancel = function () {
        for (var i = $scope.orderItems.length; i--;) {
            var order = $scope.orderItems[i];
            // undelete
            if (order.isDeleted) {
                delete order.isDeleted;
            }
            // remove new
            if (order.isNew) {
                $scope.orderItems.splice(i, 1);
            }
        }
    };

    // save edits
    $scope.saveTable = function () {
        for (var i = $scope.orderItems.length; i--;) {
            var order = $scope.orderItems[i];
            // actually delete order
            if (order.isDeleted) {
                $scope.orderItems.splice(i, 1);
            }
            // mark as not new
            if (order.isNew) {
                order.isNew = false;
            }
            if (order.name === null || order.name === undefined || order.name.length === 0 ||
                order.drinkName === null || order.drinkName === undefined || order.drinkName.length === 0 ||
                order.drinkName === null || order.drinkName === undefined) {
                $scope.orderItems.splice(i, 1);
            }
        }
        summary();
    };

    $scope.onEditClick = function (form) {
        form.$show();
        $scope.addOrder();
    };

    //@nhancv TODO: Summary
    $scope.summaryList = {};
    /*************************************************
     * item: {
     *  drinkName
     *  drinkPrice
     *  orderQuantity
     *  orderName
     * }
     */
    //@nhancv TODO: Collect drink item
    function summary() {
        $scope.summaryList = {};
        $scope.orderItems.forEach(function (t) {
            if($scope.summaryList.hasOwnProperty(t.drinkName)){
                var tmp = $scope.summaryList[t.drinkName];
                tmp.orderQuantity +=1;
                tmp.orderName += ',' + t.name;
            }else{
                $scope.summaryList[t.drinkName] = {
                    drinkName: t.drinkName,
                    drinkPrice: t.drinkPrice,
                    orderQuantity: t.orderQuantity,
                    orderName: t.name
                };
            }
        });


        console.log($scope.summaryList);
    }

});


jQuery(document).ready(function ($) {

    $(window).on('load', function () {
    });
});