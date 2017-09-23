'use strict';
var app = angular.module('app', ['ngStorage', 'xeditable', 'ui.select', 'app.models', 'app.services', 'app.filters', 'toastr']);
app.config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
    uiSelectConfig.resetSearchInput = true;
    uiSelectConfig.appendToBody = true;
});
app.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});
app.controller('appController', function ($scope, $localStorage, $sessionStorage, $filter, toastr, sFirebase, sUtil, menu) {

    $scope.screen = 'HOME'; //HOME, MENU, DASHBOARD
    $scope.groupCreated = false; //HOME, MENU, DASHBOARD
    $scope.group = {
        config: {
            key: null,
            name: null,
            date: null,
            menu: 'sodo',
            link: null
        },
        data: {}
    };

    $scope.onCreateList = function () {
        if ($scope.group.config.name === null) {
            toastr.error('Name must be not empty', 'Error');
        } else {
            var groupKey = sFirebase.genKey('/');
            $scope.group.config.key = groupKey;
            $scope.group.config.date = new Date().toUTCString();
            $scope.group.config.link = '/order?k=' + groupKey + '&s=';
            sFirebase.write(groupKey, $scope.group, function () {
                toastr.success('Successfully', 'Create list');
                $scope.groupCreated = true;
            });
        }

    };

    var key = sUtil.getParameterByName('k');
    var screen = sUtil.getParameterByName('s');

    if (key !== null && screen === 'MENU') {
        $localStorage.$default({
            groupKey: null,
            menuLocalOrders: []
        });
        $localStorage.groupKey = key;
        if (key !== $localStorage.groupKey) {
            $localStorage.menuLocalOrders = [];
        }

        $scope.menuLocalOrders = $localStorage.menuLocalOrders;
        $scope.menuTotalPrice = 0;
        $scope.screen = screen;
        sFirebase.readOne(key, function (group) {
            if (group === null) {
                window.location.href = "./";
                return;
            }

            //@nhancv TODO: Prepare menu
            $scope.menuContact = menu[group.config.menu].contact;
            $scope.drinkItems = menu[group.config.menu].details;
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
            $scope.menuShowOrderForm = 0;
            $scope.menuOrderInfo = {
                name: null,
                quantity: 1
            };

            $scope.onMenuOrderItem = function (menuItem) {

                if ($scope.menuOrderInfo.name === null || $scope.menuOrderInfo.name.length === 0) {
                    toastr.error('Name must be not empty', 'Error');
                    return;
                }

                var orderItem = {
                    id: sUtil.getUid(),
                    name: $scope.menuOrderInfo.name,
                    orderQuantity: $scope.menuOrderInfo.quantity,
                    drinkName: menuItem.name,
                    drinkPrice: menuItem.price
                };

                sFirebase.write(key + '/data/' + orderItem.id, orderItem, function () {
                    toastr.success('Successfully', 'Order');
                    $scope.menuLocalOrders.push(orderItem);
                    $localStorage.menuLocalOrders = $scope.menuLocalOrders;
                    menuTotalPriceUpdate();
                });

            };

            //@nhancv TODO: Listen changing
            sFirebase.listen(key + '/data', function (data) {
                if (data !== null) {
                    group.data = data;
                    menuOrderUpdates(group.data);
                    try {
                        $scope.$evalAsync();
                    } catch (e) {
                    }
                }
            });

            try {
                menuOrderUpdates(group.data);
                $scope.$evalAsync();
            } catch (e) {
            }

        });
    } else if (key !== null && screen === 'DASHBOARD') {
        $localStorage.$default({
            groupKey: null,
            orderItems: []
        });
        $localStorage.groupKey = key;
        if (key !== $localStorage.groupKey) {
            $localStorage.orderItems = [];
        }

        $scope.orderItems = $localStorage.orderItems;
        $scope.screen = screen;
        sFirebase.readOne(key, function (group) {
            if (group === null) {
                window.location.href = "./";
                return;
            }

            //@nhancv TODO: Prepare menu
            $scope.menuContact = menu[group.config.menu].contact;
            $scope.drinkItems = menu[group.config.menu].details;
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

            $scope.onDrinkSelect = function (order, data) {
                order.drinkPrice = $scope.getDrinkItemPrice(data);
            };

            $scope.validateEmpty = function (data) {
                if (data === null || data === undefined) {
                    return "Required"
                }
            };
            $scope.validateQuantity = function (data) {
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
                    id: sUtil.getUid(),
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

                var dataWrite = {};
                for (var k = $scope.orderItems.length; k--;) {
                    var item = $scope.orderItems[k];
                    dataWrite[item.id] = item;
                }

                sFirebase.write(key + '/data', dataWrite, function () {
                    toastr.success('Successfully', 'Order');
                    dashboardSummaryUpdate();
                    $localStorage.orderItems = $scope.orderItems;

                });

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
            $scope.totalQuantity = 0;
            $scope.totalPrice = 0;

            //@nhancv TODO: Export to pdf
            $scope.export = function () {
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
            };

            //@nhancv TODO: Listen data changing
            sFirebase.listen(key + '/data', function (data) {
                if (data !== null) {
                    group.data = data;
                    dashboardOrderUpdates(group.data);
                    try {
                        $scope.$evalAsync();
                    } catch (e) {
                    }
                }
            });

            try {
                dashboardOrderUpdates(group.data);
                $scope.$evalAsync();
            } catch (e) {
            }
        });
    }

    function dashboardSummaryUpdate() {
        $scope.summaryList = {};

        var groupItemUser = {};
        $scope.orderItems.forEach(function (t) {
            if (!groupItemUser.hasOwnProperty(t.drinkName)) {
                groupItemUser[t.drinkName] = {};
            }
            if (!groupItemUser[t.drinkName].hasOwnProperty(t.name)) {
                groupItemUser[t.drinkName][t.name] = 0;
            }
            groupItemUser[t.drinkName][t.name] += t.orderQuantity;


            var orderNames = '';
            for (var key in groupItemUser[t.drinkName]) {
                orderNames += key + '(' + groupItemUser[t.drinkName][key] + ");";
            }
            if (orderNames.length > 0 && orderNames[orderNames.length - 1] === ';') {
                orderNames = orderNames.substr(0, orderNames.length - 1);
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
        dashboardTotalPriceUpdate();
        dashboardTotalQuantityUpdate();
    }

    function dashboardTotalQuantityUpdate() {
        $scope.totalQuantity = 0;
        for (var key in $scope.summaryList) {
            $scope.totalQuantity += $scope.summaryList[key].orderQuantity;
        }
    }

    function dashboardTotalPriceUpdate() {
        $scope.totalPrice = 0;
        for (var key in $scope.summaryList) {
            $scope.totalPrice += $scope.summaryList[key].drinkPrice * $scope.summaryList[key].orderQuantity;
        }
    }

    function dashboardOrderUpdates(_data) {
        if (key === $localStorage.groupKey && _data) {
            $localStorage.orderItems = Object.values(_data);
        } else {
            $localStorage.orderItems = [];
        }

        $scope.orderItems = $localStorage.orderItems;
        if ($scope.orderItems.length > 0) {
            dashboardSummaryUpdate();
        }
    }

    function menuOrderUpdates(_data) {
        if (key === $localStorage.groupKey && _data) {
            var data = Object.values(_data);
            var tmp = [];
            var needUpdate = false;
            for (var i = 0; i < $localStorage.menuLocalOrders.length; i++) {
                var find = -1;
                for (var j = 0; j < data.length; j++) {
                    if ($localStorage.menuLocalOrders[i].id === data[j].id) {
                        find = j;
                        if (
                            $localStorage.menuLocalOrders[i].name !== data[j].name ||
                            $localStorage.menuLocalOrders[i].orderQuantity !== data[j].orderQuantity ||
                            $localStorage.menuLocalOrders[i].drinkName !== data[j].drinkName ||
                            $localStorage.menuLocalOrders[i].drinkPrice !== data[j].drinkPrice) {
                            needUpdate = true;
                        }
                        break;
                    }
                }
                if (find > -1 && find < data.length) {
                    tmp.push(data[find]);
                }
            }

            if ($localStorage.menuLocalOrders.length !== tmp.length) needUpdate = true;
            if (needUpdate) {
                $localStorage.menuLocalOrders = tmp;
                toastr.info('Refresh');
            }

        } else {
            $localStorage.menuLocalOrders = [];
        }
        $scope.menuLocalOrders = $localStorage.menuLocalOrders;
        menuTotalPriceUpdate();
    }

    function menuTotalPriceUpdate() {
        $scope.menuTotalPrice = 0;
        $scope.menuLocalOrders.forEach(function (t) {
            $scope.menuTotalPrice += t.drinkPrice * t.orderQuantity;
        });
    }
})
;


jQuery(document).ready(function ($) {

    $(window).on('load', function () {
    });
});