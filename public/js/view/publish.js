// publish.js

define(function(require, exports, module) {
    require('../component/fileupload');
    require('../component/selectgear');
    var Activity = require('../entity/activity'),
        SelectTagView = require('./selectTag'),
        EditIntroView = require('./editIntro');

    // 主视图和子视图都绑定到同一个model中，这样就可以根据model进行视图的通信了
    var PublishView = Backbone.SView.extend({
        tagName: "div",
        id: 'publishMain',
        className: 'mainview',
        template: _.template($('#publishTmpl').html()),
        events: {
            'tap .back': 'goBack',
            'click .item[href]': 'disabledRedirect',
            'tap #selectTag': 'showSelectTagView',
            'tap #editIntro': 'showEditIntroView',
            'tap #publish': 'submit',
            'open:selectgear #timeSelect': 'beforeTimeSelectShow',
            'tap #timeSelBtn': 'timeSelect'
        },

        initialize: function (opts) {
            if(opts.activityId) {
                this.curActivityId=opts.activityId;
            }
            this.editIntroView=null;
            this.selectTagView=null;
        },
        render: function () {
            this.getModel(function () {
                var data=this.model.toJSON();
                var htm=this.template(data);
                this.$el.html(htm);
                var that=this;
                this.$("#uploadIpt").upload({
                    showArea: this.$(".imglist"),
                    isPush: false,
                    serverUrl: '/commons/upload',
                    progress: true
                }).on("success:upload", function (e, imgurl) {
                    that.model.set('cover', imgurl);
                    console.log("upload success");
                }).on("ing:upload", function (e, precent) {
                    console.log("进度:" +precent);
                });
            });
            return this;
        },
        beforeTimeSelectShow: function (e) {
            var relatedTarget=e.relatedTarget;
            if(!relatedTarget) return;
            this.timeRelatedTar=$(relatedTarget);
        },
        timeSelect: function () {
            var timeEl=this.$('#timeSelect');
            var year=timeEl.find('#year .z-active').data('value');
            var month=timeEl.find('#month .z-active').data('value');
            var day=timeEl.find('#day .z-active').data('value');
            if(!year||!month||!day) {
                timeEl.selectgear('close');
                return;
            }
            // var temp=new Date(parseInt(year), parseInt(month)-1, parseInt(day));
            var temp=year+'-'+month+'-'+day;
            this.timeRelatedTar.html(year+'-'+month+'-'+day);
            if(this.timeRelatedTar.is('.begin')) {
                this.model.set('beginTime', temp);
            }else if(this.timeRelatedTar.is('.end')) {
                this.model.set('endTime', temp);
            }
            timeEl.selectgear('close');
        },
        setCurActivityId: function (id) {
            id!=null && (this.curActivityId=id);
        },
        submit: function () {
            var attrs={
                email: this.$(".email .val").val().trim(),
                header: this.$(".header .val").val().trim(),
                link: this.$(".link .val").val().trim()
            };
            var msg=this.model.isNew() ? "添加成功":"保存成功"; // 添加成功后，会更新model的id,即这里的_id
            this.model.save(attrs, {
                success: function (model) {
                    alert(msg);
                }
            });
        },
        getModel: function (callback) {
            !_.isFunction(callback) && (callback=function(){});
            var that=this,
                listenModel = function() {
                    that.listenTo(that.model, 'change:tag', function (model, value) {
                        var txts=_.map(value, function (item, index) {
                            return item.tagName;
                        });
                        var vals=_.map(value, function (item, index) {
                            return item._id;
                        });
                        that.$("#selectTag .val").text(txts.join("-")).data('value', vals.join("-"));
                        // model.set("tag", vals, {silent: true});
                    }).listenTo(that.model, 'change:intro', function (model, value) {
                        that.$("#editIntro .val").text(value).data('value', value);
                    });
                };
            if(this.curActivityId == null) {
                that.model=new Activity();
                listenModel();
                callback.call(that);
            }else {
                var model=new Activity({_id: this.curActivityId});
                model.fetch({
                    success: function (model, resp) {
                        that.model=model;
                        listenModel();
                        callback.call(that);
                    }
                });
            }
        },
        initSubView: function (subview) {
            var $el=this.$el;
            subview.registerGoBack(function () {
                this.once('out.success', function () {
                    subview.remove();
                }).once('out.before', function () {
                    $el.show();
                });
                this.fadeOut();
            });
            $("body").append(subview.render().$el);
            subview.once('in.success', function () {
                $el.hide();
            });
            subview.leftIn();
        },
        showSelectTagView: function (e) {
            var selectTagView=new SelectTagView({model: this.model});
            this.initSubView(selectTagView);
        },
        showEditIntroView: function (e) {
            var editIntroView=new EditIntroView({model: this.model});
            this.initSubView(editIntroView);  
        },
        disabledRedirect: function (e) {
            e.preventDefault();  
        },
        goBack: function () {
            this._goBack();
        },
        _goBack: function () {
            history.back();
        },
        registerGoBack: function (func) {
            this._goBack=func;
        }
    });

    module.exports = PublishView;

});