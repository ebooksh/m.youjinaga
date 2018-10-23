// util.js

define(function(require, exports, module) {
    var ls = localStorage,
        encode = encodeURIComponent,
        decode = decodeURIComponent;

    function isEmpty (obj) {
        return obj == null;
    }
    exports.isEmpty=isEmpty;

    exports.DelayUtil={
        delayTimer: null,
        delayDo: function (func, interval) {
            if(this.delayTimer) {
                clearTimeout(this.delayTimer);
                this.delayTimer=null;
            }
            this.delayTimer=setTimeout(function () {
                func();
            }, interval||0);
        }
    };

    exports.localDbUitl={
        get: function(key) {
            var res = decode(ls.getItem(encode(key)));
            try {
                return JSON.parse(res);
            } catch (err) {
                return res;
                console.error(err);
            }
        },
        set: function(key, val) {
            var t=encode(JSON.stringify(val));
            ls.setItem(encode(key), t);
            return t;
        },
        remove: function(key) {
            var val=this.get(key);
            ls.removeItem(encode(key));
            return val;
        },
        clear: function() {
            ls.clear();
        },
        push: function (key, val) {
            var old=this.get(key);
            if(_.isArray(old)) {
                old.indexOf(val) == -1 && old.push(val);
                return this.set(key, old);
            }else if(isEmpty(old)) {
                return this.set(key, [val]);
            }else {
                throw new Error('该项不是数组');
            }
        }
    };

    exports.cookieUtil={
        getCookie: function() {

        },
        setCookie: function() {

        },
        removeCookie: function() {

        }
    };



});