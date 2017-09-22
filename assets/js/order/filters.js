angular.module('app.filters', [])

    .filter('fPrice', function () {
        return function (p) {
            if(p !== undefined && p !== null){
                return p + "k (VND)"
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