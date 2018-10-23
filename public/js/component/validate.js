// validate

define(function(require, exports, module) {
    var re = {};
    re.require = /.+/;
    re.number = /^\d+$/;
    //手机号
    re.mobile = /^((13)|(14)|(15)|(17)|(18))\d{9}$/;
    re.email = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
    //注册代码，手机号，邮箱
    re.registCode = /^(((13)|(14)|(15)|(17)|(18))\d{9})|(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)$/i;
    //登录代码，手机号，登录帐号，邮箱
    re.loginCode = /^([a-z]\w{3,15})|(((13)|(14)|(15)|(17)|(18))\d{9})|(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)$/i;
    re.password = /^.{6,16}$/;
    re.userName = /^[\u0391-\uFFE5]{2,10}$/;
    re.companyName = /.{4,50}$/;
    re.validCode = /^[0-9a-zA-Z]{4,6}$/;
    re.zip = /^[1-9]\d{5}$/;
    re.cardNo = /^[1-9]\d{11,22}$/;

    // 默认的一些验证规则，可以在validate时传入配置项自定义修改
    var defNeedValidateObj = {
        email: {
            desc: "邮箱",
            require: "email"
        },
        header: {
            desc: "标题",
            require: "require"
        },
        intro: {
            desc: "介绍",
            require: "require"
        }
    };

    var obj = {};
    ['require', 'number', 'mobile', 'email', 'registCode', 'loginCode', 'password', 'userName', 'validCode'].forEach(function(item, index) {
        obj[item] = function(re_name) {
            return function(val) {
                var reg = re[re_name];
                return reg.test(val);
            };
        }(item);
    });

    /*
     * 参数：
     * 1. @object attr, [@object option]
     * 2. @string key, @string val, [@object option]
     * 
     * 返回值：
     * type: 验证类型
     * key: 告诉别人哪一项
     * desc: 中文描述
     * status: true/false
     */
    obj.validate = function() {
        var src, opts;
        var args = [].slice.call(arguments, 0);
        if (args.length < 1) return true;
        else if (args.length == 1) {
            src = args[0];
            opts = {};
        } else if (args.length == 2) {
            src = args[0];
            opts = args[1];
        } else if (args.length === 3) {
            src = {};
            src[args[0]] = args[1];
            opts = args[2];
        }
        var finalopts = $.extend({}, defNeedValidateObj, opts);
        var validateResult = {
            status: true
        };
        // _.each和$.each是不一样的，前者如果回调函数返回false就结束循环了
        $.each(src, function(key, val) {
            var desc = finalopts[key];
            if (!desc) return true; // 不存在验证规则就直接return true；遍历下一个
            var requires = desc.require.split(" "); // 验证规则数组
            validateResult = obj._validate(requires, val, desc);
            if (!validateResult.status) {
                validateResult.key=key;
                return false;
            }
        });

        return validateResult;
    };
    obj._validate = function(requires, val, opt) {
        var result = {
            status: true
        };
        $.each(requires, function(index, item) {
            if (!obj[item](val)) {
                result = {
                    status: false,
                    type: item,
                    desc: obj.getDefaultDesc(item, opt)
                }
                return false;
            }
        });
        return result;
    };
    obj.getDefaultDesc=function (requiretype, opt) {
        var cache={
            require: "不能为空",
            other: "格式不正确"
        };
        var part=cache[requiretype] || cache.other;
        return opt.desc+part;
    };

    module.exports = obj;

});