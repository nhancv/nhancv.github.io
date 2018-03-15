angular.module('app.filters', [])

    .filter('fPrice', function () {
        return function (p) {
            if(p !== undefined && p !== null){
                return p + "k"
            }
            return p;
        }
    })
    .filter('fTime', function () {
        return function (p) {
            if(p !== undefined && p !== null){
                var date = new Date(p);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                // Will display time in 10:30:23 format
                return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
            }
            return p;
        }
    })
    .filter('fDrinkSearch', function (sUtil) {
        return function (arr, search) {
            var filtered = [];
            if (search === undefined || arr === undefined) {
                return arr;
            }
            if (search.length === 0) return arr;
            angular.forEach(arr, function (item) {
                if (sUtil.compareVi(item, search)) {
                    filtered.push(item);
                }
            });
            if(filtered.length === 0) {
                filtered.push(search);
            }
            return filtered;
        };
    })

;