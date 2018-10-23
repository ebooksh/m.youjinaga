// model-tag.js

define(function(require, exports, module) {
    var Tag = Backbone.Model.extend({
        idAttribute: "_id",
        defaults: function() {
            return {
                tagName: "",
                heat: 0
            };
        }
    });

    var TagList = Backbone.Collection.extend({
        model: Tag,
        url: function () {
            return '/commons/tags';
        },
        parse: function (resp) {
            // 因为后台返回的是{code: ..., data: ...}形式的
            return resp.data;
        }

    });

    exports.Tag = Tag;
    exports.TagList = TagList;
});