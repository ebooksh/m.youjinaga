// jsonResult.js
// 将xhr请求的结果包装为为如：{code:1, data:"results"}形式

var TipMsg=require("./spec").TipMsg;

exports.fail=function (code, msg) {
    code = isNaN(parseInt(code)) ? 0 : code;
    return {
        code: code,
        msg: msg || TipMsg.getValue(code) 
    };
};

exports.succ=function (data) {
    return {
        code: 1,
        data: data
    };
};


