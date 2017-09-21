'use strict';
var app = angular.module('app', ['ngStorage', 'xeditable']);

app.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
app.controller('appController', function ($scope, $localStorage, $sessionStorage, $filter) {
    //@nhancv TODO: Test xeditable
    $scope.users = [
        {id: 1, name: 'awesome user1', status: 2, group: 2},
        {id: 2, name: 'awesome user2', status: undefined, group: 1},
        {id: 3, name: 'awesome user3', status: 2, group: null}
    ];

    $scope.statuses = [
        {value: 1, text: 'status1'},
        {value: 2, text: 'status2'},
        {value: 3, text: 'status3'},
        {value: 4, text: 'status4'}
    ];

    $scope.groups = [
        {
            id: 1,
            text: 'admin'
        },
        {
            id: 2,
            text: 'vip'
        }];
    $scope.loadGroups = function () {
        return $scope.groups
    };

    $scope.showGroup = function (user) {
        if (user.group && $scope.groups.length) {
            var selected = $filter('filter')($scope.groups, {id: user.group});
            return selected.length ? selected[0].text : 'Not set';
        } else {
            return user.groupName || 'Not set';
        }
    };

    $scope.showStatus = function (user) {
        var selected = [];
        if (user.status) {
            selected = $filter('filter')($scope.statuses, {value: user.status});
        }
        return selected.length ? selected[0].text : 'Not set';
    };

    $scope.checkName = function (data, id) {
        if (id === 2 && data !== 'awesome') {
            return "Username 2 should be `awesome`";
        }
    };

    // filter users to show
    $scope.filterUser = function (user) {
        return user.isDeleted !== true;
    };

    // mark user as deleted
    $scope.deleteUser = function (id) {
        var filtered = $filter('filter')($scope.users, {id: id});
        if (filtered.length) {
            filtered[0].isDeleted = true;
        }
    };

    // add user
    $scope.addUser = function () {
        $scope.users.push({
            id: $scope.users.length + 1,
            name: '',
            status: null,
            group: null,
            isNew: true
        });
    };

    // cancel all changes
    $scope.cancel = function () {
        for (var i = $scope.users.length; i--;) {
            var user = $scope.users[i];
            // undelete
            if (user.isDeleted) {
                delete user.isDeleted;
            }
            // remove new
            if (user.isNew) {
                $scope.users.splice(i, 1);
            }
        }
        ;
    };

    // save edits
    $scope.saveTable = function () {
        var results = [];
        for (var i = $scope.users.length; i--;) {
            var user = $scope.users[i];
            // actually delete user
            if (user.isDeleted) {
                $scope.users.splice(i, 1);
            }
            // mark as not new
            if (user.isNew) {
                user.isNew = false;
            }

            // send on server
            console.log('results', results);
        }

    };


    ///
    $scope.drinkItems = [
        {
            name: 'Trà sữa thập cẩm',
            price: '20'
        },
        {
            name: 'Trà sữa thập cẩm',
            price: '20'
        },
        {
            name: 'Trà sữa thập cẩm',
            price: '20'
        },
    ];
});


jQuery(document).ready(function ($) {

    $(window).on('load', function () {
    });
});