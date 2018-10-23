// model-comment.js

define(function(require, exports, module) {
    var Comment = Backbone.Model.extend({
        idAttribute: "_id",
        defaults: function() {
            return {
                activityId: "",
                userId: {}, // user的整个实例
                content: "",
                time: (new Date()).parse("yyyy-mm-dd")
            };
        },
        validate: function(attrs, options) {
            if (!attrs.activityId || !attrs.userId || !attrs.content) {
                return "缺少必要字段";
            }
        },
        parse: function (resp) {
            // time字段返回的是字符串形式，要转换为yyyy-mm-dd格式
            var t=new Date(resp.time);
            resp.time=t;
            return resp;
        }
    });

    var CommentList = Backbone.Collection.extend({
        model: Comment,
        url: function () {
            // fetch,create,update都是使用这个地址，只是请求的类型（get,post,update）不一样
            // 对应每一个活动的所有评论
            return '/activities/'+this.activityId+"/comments";
        },
        initialize: function (opts) {
            opts.activityId && (this.activityId=opts.activityId);
        }
    });

    exports.Comment = Comment;
    exports.CommentList = CommentList;
});