angular.module('app.services', [])

    .service('sFirebase', function () {
        //https://firebase.google.com/docs/database/web/read-and-write
        var database = firebase.database();

        this.write = function (key, data) {
            database.ref(key).set(data);
        };
        this.listen = function (key, onData) {
            database.ref(key)
                .on('value', function (snapshot) {
                    onData(snapshot.val())
                });
        };
        this.readOne = function (key, onData) {
            return database.ref(key).once('value').then(function (snapshot) {
                onData(snapshot.val());
            });
        };
        this.remove = function (key) {
            database.ref(key).remove();
        };
        this.offListen = function (key) {
            database.ref(key).off();
        };
        this.update = function (updateObject) {
            database.ref().update(updateObject)
        };
        this.genKey = function (parentKey) {
            return database.ref().child(parentKey).push().key;
        }
    })
    .service('sUtil', function () {
        this.convertViToEn = function (alias) {
            var str = alias;
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            return str;
        };

        this.compareVi = function (base, search) {
            return this.convertViToEn(base).indexOf(this.convertViToEn(search)) !== -1;
        }
    })


;