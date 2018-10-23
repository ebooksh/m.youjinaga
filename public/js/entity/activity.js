// model-activity.js

define(function(require, exports, module) {
    var validateObj=require('../component/validate');

    function getDate (str) {
        var parts=str.split('-');
        var d=new Date(parts[0], parts[1], parts[2]);
        return d;
    }

    var Activity = Backbone.Model.extend({
        defaults: function () {
            return {
                email: "",
                header: "",
                tag: [], // 读取的时候每一项为：{tagName: xxx, _id: xxx, ...}类型
                beginTime: (new Date()).parse("yyyy-mm-dd"),
                endTime: (new Date()).parse("yyyy-mm-dd"),
                link: "",
                intro: "",
                cover: ""
            }
        },
        validate: function (attrs, options) {
            var result=validateObj.validate(attrs);
            var b=getDate(attrs.beginTime).getTime(),
                e=getDate(attrs.endTime).getTime();
            if(b>e) {
                alert('结束时间不能小于开始时间');
                return '结束时间不能小于开始时间';
            }
            if(!result.status) {
                alert(result.desc);
                return result;
            }
        },
        parse: function (resp) {
            // time字段返回的是字符串形式，要转换为yyyy-mm-dd格式
            var t=new Date(resp.beginTime);
            resp.beginTime=t.parse("yyyy-mm-dd");
            t=new Date(resp.endTime);
            resp.endTime=t.parse("yyyy-mm-dd");
            return resp;
        },
        // 对应服务器上的地址格式为: /activities/[id]
        urlRoot: '/activities',
        // id映射为attributes里的_id, model.id时得到的值时attributes里的_id对应的值
        idAttribute: '_id'
    });

    /*
     * 执行url(): 生成 URLs 的默认形式为："/[collection.url]/[id]"， (注意：是中括号，没有的话就省略了)如果模型不是集合的一部分，你可以通过指定明确的urlRoot覆盖
     * url()返回的值就是对应的操作模型的服务器上的地址，如model.fetch就是从这个地址取数据的
     * fetch 适用于惰性加载不需立刻展现的模型数据
     */

    module.exports = Activity;
});