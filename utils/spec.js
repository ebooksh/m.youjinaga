// spec.js
// 全局的常量

// tip
exports.TipMsg = {
    "0": "系统出现错误，请稍候重试",
    getValue: function(code) {
        var res = this[String(code)];
        if (!res) res = this["0"];
        return res;
    }
};