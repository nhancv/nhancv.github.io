'use strict';
var app = angular.module('app', ['ngStorage', 'xeditable', 'ui.select', 'app.models', 'app.services', 'app.filters', 'app.directives', 'toastr']);
app.config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
    uiSelectConfig.resetSearchInput = true;
    uiSelectConfig.appendToBody = true;
});
app.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});
angular.module('app.directives', [])
    .directive('fbSend', function () {
        function createHTML(href) {
            return '<div class="fb-send" ' +
                'data-href="' + href + '"> ' +
                '</div>';
        }

        return {
            restrict: 'EA',
            scope: {},
            link: function postLink(scope, elem, attrs) {
                attrs.$observe('pageHref', function (newValue) {
                    elem.html(createHTML(newValue));
                    try {
                        FB.XFBML.parse(elem[0]);
                    } catch (e) {
                    }
                });
            }
        };
    });
app.controller('appController', function ($scope, $localStorage, $sessionStorage, $filter, toastr, sFirebase, sUtil, menu) {

    $scope.isLoading = false;

    $scope.screen = 'HOME'; //HOME, MENU, DASHBOARD
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
        $scope.groupConfig = {};

        //@nhancv TODO: declare menu function

        var menuTotalPriceUpdate = function () {
            $scope.menuTotalPrice = 0;
            $scope.menuLocalOrders.forEach(function (t) {
                $scope.menuTotalPrice += t.drinkPrice * t.orderQuantity;
            });
        };

        var menuOrderUpdates = function (_data) {
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
        };

        showLoading(true);
        sFirebase.readOne(key, function (group) {
            showLoading(false);
            if (group === null) {
                toastr.info('Order is not exist.');
                setTimeout(function () {
                    window.location.href = "./";
                }, 300);
                return;
            }
            $scope.groupConfig = group.config;

            //@nhancv TODO: Prepare menu
            $scope.menuContact = menu[group.config.menu].contact;
            $scope.drinkItems = menu[group.config.menu].details;
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
                    drinkPrice: menuItem.price,
                    time: Date.now()
                };

                showLoading(true);
                sFirebase.write(key + '/data/' + orderItem.id, orderItem, function () {
                    toastr.success('Successfully', 'Order');
                    $scope.menuLocalOrders.push(orderItem);
                    $localStorage.menuLocalOrders = $scope.menuLocalOrders;
                    menuTotalPriceUpdate();
                    showLoading(false);
                });

            };

            //@nhancv TODO: Listen changing
            sFirebase.listen(key, function (_group) {
                if (_group === null) {
                    toastr.info('Order has been destroyed.');
                    setTimeout(function () {
                        window.location.href = "./";
                    }, 350);
                } else {
                    group = _group;

                    $scope.groupConfig = group.config;
                    var data = group.data;
                    if (data !== null) {
                        group.data = data;
                        menuOrderUpdates(group.data);
                        try {
                            $scope.$evalAsync();
                        } catch (e) {
                        }
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
        $scope.groupConfig = {};

        //@nhancv TODO: declare dashboard function

        var dashboardTotalQuantityUpdate = function () {
            $scope.totalQuantity = 0;
            for (var key in $scope.summaryList) {
                $scope.totalQuantity += $scope.summaryList[key].orderQuantity;
            }
        };

        var dashboardTotalPriceUpdate = function () {
            $scope.totalPrice = 0;
            for (var key in $scope.summaryList) {
                $scope.totalPrice += $scope.summaryList[key].drinkPrice * $scope.summaryList[key].orderQuantity;
            }
        };

        var dashboardSummaryUpdate = function () {
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
                        orderName: orderNames,
                        time: t.time
                    };
                }
            });
            dashboardTotalPriceUpdate();
            dashboardTotalQuantityUpdate();
        };

        var dashboardOrderUpdates = function (_data) {
            if (key === $localStorage.groupKey && _data) {
                var data = Object.values(_data);
                data.sort(function (a, b) {
                    return a.time - b.time;
                });

                $localStorage.orderItems = data;
            } else {
                $localStorage.orderItems = [];
            }

            $scope.orderItems = $localStorage.orderItems;
            if ($scope.orderItems.length > 0) {
                dashboardSummaryUpdate();
            }
        };

        var getDrinkItemPrice = function (name) {
            for (var i = 0; i < $scope.drinkItems.length; i++) {
                var t = $scope.drinkItems[i];
                if (t.name === name) {
                    return t.price;
                }
            }
            return 20;
        };

        showLoading(true);
        sFirebase.readOne(key, function (group) {
            showLoading(false);
            if (group === null) {
                toastr.info('Order is not exist.');
                setTimeout(function () {
                    window.location.href = "./";
                }, 350);
                return;
            }
            $scope.groupConfig = group.config;

            //@nhancv TODO: Prepare menu
            $scope.menuContact = menu[group.config.menu].contact;
            $scope.drinkItems = menu[group.config.menu].details;
            $scope.dashboardGetDrinkItemNames = function () {
                var arr = [];
                $scope.drinkItems.forEach(function (t) {
                    arr.push(t.name);
                });
                return arr;
            };

            $scope.onDashboardDrinkSelect = function (order, data) {
                order.drinkPrice = getDrinkItemPrice(data);
            };

            $scope.onDashBoardValidateEmpty = function (data) {
                if (data === null || data === undefined) {
                    return "Required"
                }
            };
            $scope.onDashBoardValidateQuantity = function (data) {
                if (data === null || data === undefined || data === 0 || data > 100) {
                    return "0< Qty <=100"
                }
            };

            $scope.onDashboardFilterOrder = function (order) {
                return order.isDeleted !== true;
            };

            $scope.onDashboardRemoveOrder = function (id) {
                var filtered = $filter('filter')($scope.orderItems, {id: id});
                if (filtered.length) {
                    filtered[0].isDeleted = true;
                }
            };

            $scope.onDashboardAddOrder = function () {
                $scope.orderItems.push({
                    id: sUtil.getUid(),
                    name: '',
                    drinkName: null,
                    drinkPrice: null,
                    orderQuantity: 1,
                    time: Date.now(),
                    isNew: true
                });
            };

            $scope.onDashboardCancelChange = function () {
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

            $scope.onDashboardSaveTable = function () {
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

                showLoading(true);
                sFirebase.write(key + '/data', dataWrite, function () {
                    toastr.success('Successfully', 'Order');
                    dashboardSummaryUpdate();
                    $localStorage.orderItems = $scope.orderItems;
                    showLoading(false);
                });

            };

            $scope.onDashboardClearAllOrder = function (form) {
                $scope.orderItems = [];
                $localStorage.orderItems = $scope.orderItems;
                form.$submit();
            };

            $scope.onDashboardEditOrder = function (form) {
                form.$show();
                $scope.onDashboardAddOrder();
            };

            //@nhancv TODO: Summary
            $scope.summaryList = {};
            $scope.totalQuantity = 0;
            $scope.totalPrice = 0;

            //@nhancv TODO: Export to pdf
            $scope.dashBoardExport = function (onFinish) {
                html2canvas(document.getElementById('export'), {
                    onrendered: function (canvas) {
                        var data = canvas.toDataURL();
                        var docDefinition = {
                            content: [{
                                image: data,
                                width: 500
                            }]
                        };

                        try {
                            if ($scope.orderItems.length > 0) {
                                pdfMake.createPdf(docDefinition).download("order" + key + ".pdf");
                            }
                            if (onFinish) onFinish();
                        } catch (e) {
                            console.error(e);
                        }
                    }
                });
            };

            $scope.onDashboardFinishOrder = function (finish) {
                sFirebase.write(key + '/config/finish', finish, function () {
                    if (finish) {
                        toastr.info('Order finished');
                        $scope.dashBoardExport();
                    } else {
                        toastr.info('Order in edit mode');
                    }
                });
            };

            $scope.onDashboardDestroyOrder = function () {
                $scope.dashBoardExport(function () {
                    sFirebase.offListen(key);
                    sFirebase.remove(key);
                    toastr.info('Order has been destroyed');
                    setTimeout(function () {
                        window.location.href = "./";
                    }, 350);
                });
            };

            //@nhancv TODO: Listen data changing
            sFirebase.listen(key, function (_group) {
                if (_group === null) {
                    toastr.info('Order has been destroyed.');
                    setTimeout(function () {
                        window.location.href = "./";
                    }, 350);
                } else {
                    group = _group;

                    $scope.groupConfig = group.config;
                    var data = group.data;
                    if (data !== null) {
                        group.data = data;
                        dashboardOrderUpdates(group.data);
                        try {
                            $scope.$evalAsync();
                        } catch (e) {
                        }
                    }
                }
            });

            try {
                dashboardOrderUpdates(group.data);
                $scope.$evalAsync();
            } catch (e) {
            }
        });
    } else {
        $scope.groupCreated = false;
        $scope.groupSendLink = null;
        $scope.menuList = menu;
        $scope.group = {
            config: {
                key: null,
                name: null,
                date: null,
                menu: 'sodo',
                link: null,
                finish: false
            },
            data: {}
        };

        $scope.onCreateList = function () {
            if ($scope.group.config.name === null) {
                toastr.error('Name must be not empty', 'Error');
            } else {
                showLoading(true);
                var groupKey = sFirebase.genKey('/');
                $scope.group.config.key = groupKey;
                $scope.group.config.date = new Date().toString();
                $scope.group.config.link = '/order?k=' + groupKey + '&s=';

                $scope.groupSendLink = window.location.protocol + '//' + window.location.host + $scope.group.config.link + 'MENU';

                sFirebase.write(groupKey, $scope.group, function () {
                    toastr.success('Successfully', 'Create list');
                    $scope.groupCreated = true;
                    showLoading(false);
                });
            }

        };
    }

    function showLoading(enable) {
        $scope.isLoading = enable;
    }

})
;


jQuery(document).ready(function ($) {

    $(window).on('load', function () {
    });
});