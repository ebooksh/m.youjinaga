// info.js

define(function(require, exports, module) {
    var Activity = require('../entity/activity'),
        ActivityItemView = require('./activityItem');
    var Comment = require('../entity/comment').Comment,
        CommentList = require('../entity/comment').CommentList,
        CommentItemView = require('./commentItem');

    var InfoView = Backbone.SView.extend({
        tagName: 'div',
        id: 'infoMain',
        className: 'mainview',
        events: {
            'tap .back': 'goBack',
            'tap #comment': 'addNewComment',
            'tap .morecomment': 'renderComments'
        },
        template: _.template($('#infoTmpl').html()),

        initialize: function (opts) {
            this.comments=null;
            this.commentsPageIndex=0;
        },
        render: function () {
            if(!this.model) return this;
            var data=this.model.attributes;
            var htm=this.template(data);
            this.$el.html(htm);
            return this;
        },
        goBack: function () {
            this._goBack();
        },
        _goBack: function () {
            history.back();
        },
        registerGoBack: function (func) {
            this._goBack=func;
        },
        setCurActivityId: function (activityId) {
            // 重置默认值
            this.curActivityId=activityId;
            this.commentsPageIndex=0;
            this.comments=null;

            this.getModel(function (model) {
                this.model=model;
                this.refresh();
            });
            this.getComments();
        },
        getModel: function (callback) {
            var that=this;
            var m=new Activity({
                _id: this.curActivityId
            });
            // fetch 适用于惰性加载不需立刻展现的模型数据
            m.fetch({
                success: function (model, resp, opts) {
                    callback.call(that, model);
                }
            });
        },
        getComments: function () {
            var that=this;
            this.comments=new CommentList({ activityId: this.curActivityId });
            this.comments.fetch({
                success: function () {
                    var len=that.comments.length;
                    if(len > 0) {
                        that.$(".morecomment").removeClass("z-hide");
                        that.$(".comments").removeClass("z-hide");
                    }else {
                        that.$(".morecomment").addClass("z-hide");
                        that.$(".comments").addClass("z-hide");
                    }
                    that.$("#commentsNum").html(that.comments.length);
                    that.renderComments();
                }
            });
        },
        renderComments: function () {
            var morecomment=this.$('.morecomment');
            if(morecomment.hasClass("disabled")) return;
            var start=this.commentsPageIndex*5,
                end=start+5;
            if(start>this.comments.length) {
                morecomment.html("没有更多了").addClass("disabled");
            }else{
                var range=this.comments.slice(start, end);
                var commentsEl=this.$(".comments");
                _.each(range, function (item, index) {
                     var v=new CommentItemView({model: item});
                     commentsEl.append(v.render().$el);
                });
                this.commentsPageIndex++;
            }
        },
        addNewComment: function () {
            var val=this.$("textarea").val();
            if(!val) {
                alert("请输入内容");
                return;
            }
            var attrs={
                activityId: this.curActivityId,
                userId: '55cdfdfd31c4c07f027a689f',
                content: val
            };
            var that=this;
            this.comments.create(attrs, {
                at: 0,
                wait: true,
                success: function (model) {
                    var v=new CommentItemView({model: model});
                    that.$(".morecomment").removeClass("z-hide");
                    that.$(".comments").removeClass('z-hide').prepend(v.render().$el);
                }
            });

        },
        refresh: function () {
            this.render();
        }
    });

    module.exports = InfoView;

});