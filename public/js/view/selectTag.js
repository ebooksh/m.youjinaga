// selectTag.js

define(function(require, exports, module) {
    var Tag=require('../entity/tag').Tag,
        TagList=require('../entity/tag').TagList;

    var tmpl = ['<header class="web-hd">',
        '        <div class="navbar">',
        '            <a class="back left">返回</a>',
        '            <p class="title">选择标签</p>',
        '        </div>',
        '    </header>',
        '    <div class="web-bd">',
        '        <div class="tags">',
        '            <span class="item"><a class="inner">设计</a></span>',
        '            <span class="item z-active"><a class="inner">司法解</a></span>',
        '            <span class="item"><a class="inner">设计</a></span>',
        '            <span class="item z-active"><a class="inner">设计十分</a></span>',
        '        </div>',
        '        <div class="btns padding">',
        '            <a class="btn success block">确定</a>',
        '        </div>',
        '    </div>'
    ].join("");
    var tagItemTmpl='<span data-_id="{%- _id %}" class="{% print(selected == true ? \"z-active item\" : \"item\") %}"><a class="inner">{%- tagName %}</a></span>',
        tagItemTmplFunc=_.template(tagItemTmpl);

    // 不需要每次生成界面都去fetch，只要保存一个就好了，所有SelectTagView共享的
    // 模块只执行一次
    var Global_Tags=new TagList();
    Global_Tags.fetch();

    var SelectTagView = Backbone.SView.extend({
        tagName: "div",
        id: 'selectTagMain',
        className: 'mainview',
        template: _.template(tmpl),
        events: {
            'tap .back': 'goBack',
            'tap .item': 'selectTag',
            'tap .btn.success': 'submit'
        },

        initialize: function(opts) {
            this.listenTo(Global_Tags, 'sync', $.proxy(this.renderTags));
        },
        render: function() {
            var htm = this.template();
            this.$el.html(htm);
            this.tagsEl=this.$(".tags");
            this.renderTags();
            return this;
        },
        renderTags: function () {
            if(!Global_Tags) return;
            this.tagsEl.html('');
            Global_Tags.each($.proxy(this.addOne, this));
        },
        addOne: function (item, index) {
            var data=item.toJSON();
            var tags=_.map(this.model.get("tag"), function (item, index) {
                return item._id
            });
            data.selected= _.indexOf(tags, data._id) !== -1 ? true : false;
            var htm=tagItemTmplFunc(data);
            this.tagsEl.append(htm);
        },
        selectTag: function (e) {
            $(e.currentTarget).toggleClass("z-active");
        },
        submit: function () {
            var items=this.tagsEl.find(".z-active");
            var res=[];
            _.each(items, function (item, index) {
                res.push({
                    _id: $(item).data("_id"),
                    tagName: $(item).text()
                });
            });
            this.model.set("tag", res);
            this.goBack();
        },
        goBack: function() {
            this._goBack();
        },
        _goBack: function() {
            history.back();
        },
        registerGoBack: function(func) {
            this._goBack = func;
        }
    });

    module.exports = SelectTagView;

});