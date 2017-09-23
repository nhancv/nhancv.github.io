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
app.controller('appController', function ($scope, $localStorage, $sessionStorage, $filter, sFirebase, sUtil, menu) {

    // sFirebase.remove('test');




    //@nhancv TODO: Toggle menu && order list
    $localStorage.$default({
        menuVisible: true,
        orderListVisible: false
    });

    $scope.menuVisible = $localStorage.menuVisible;
    $scope.orderListVisible = $localStorage.orderListVisible;

    $scope.toggleMenu = function () {
        $scope.menuVisible = !$scope.menuVisible;
        $localStorage.menuVisible = $scope.menuVisible;
    };

    $scope.toggleOrderList = function () {
        $scope.orderListVisible = !$scope.orderListVisible;
        $localStorage.orderListVisible = $scope.orderListVisible;
    };

    //@nhancv TODO: Prepare menu
    $scope.menuContact = menu.sodo.contact;
    $scope.drinkItems = menu.sodo.details;
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
    $scope.validateQuantity = function (data, id) {
        if (data === null || data === undefined || data === 0 || data > 100) {
            return "0< Quantity <= 100"
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

        $localStorage.orderItems = $scope.orderItems;

    };

    $scope.clearAll = function (form) {
        $scope.orderItems = [];
        $localStorage.orderItems = $scope.orderItems;
        form.$submit();
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

        var groupItemUser = {};
        $scope.orderItems.forEach(function (t) {
            if (!groupItemUser.hasOwnProperty(t.drinkName)) {
                groupItemUser[t.drinkName] = {};
            }
            if(!groupItemUser[t.drinkName].hasOwnProperty(t.name)){
                groupItemUser[t.drinkName][t.name] = 0;
            }
            groupItemUser[t.drinkName][t.name] += t.orderQuantity;


            var orderNames = '';
            for (var key in groupItemUser[t.drinkName]) {
                orderNames += key + '(' + groupItemUser[t.drinkName][key] + ");";
            }
            if(orderNames.length > 0 && orderNames[orderNames.length-1] === ';'){
                orderNames = orderNames.substr(0, orderNames.length -1);
            }

            if ($scope.summaryList.hasOwnProperty(t.drinkName)) {
                var tmp = $scope.summaryList[t.drinkName];
                tmp.orderQuantity += t.orderQuantity;
                tmp.orderName = orderNames;
            } else {
                $scope.summaryList[t.drinkName] = {
                    drinkName: t.drinkName,
                    drinkPrice: t.drinkPrice,
                    orderQuantity: t.orderQuantity,
                    orderName: orderNames
                };
            }
        });
        getTotalPrice();
        getTotalQuantity();
    }

    $scope.totalQuantity = 0;
    $scope.totalPrice = 0;

    function getTotalQuantity() {
        $scope.totalQuantity = 0;
        for (var key in $scope.summaryList) {
            $scope.totalQuantity += $scope.summaryList[key].orderQuantity;
        }
    }

    function getTotalPrice() {
        $scope.totalPrice = 0;
        for (var key in $scope.summaryList) {
            $scope.totalPrice += $scope.summaryList[key].drinkPrice;
        }
    }

    //@nhancv TODO: Restore from cache
    if($localStorage.orderItems !== undefined){
        $scope.orderItems = $localStorage.orderItems;
        $scope.saveTable();
    }

    //@nhancv TODO: Export to pdf
    $scope.export = function(){
        html2canvas(document.getElementById('export'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("order.pdf");
            }
        });
    }

});


jQuery(document).ready(function ($) {

    $(window).on('load', function () {
    });
});