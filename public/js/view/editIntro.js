// editIntro.js

define(function(require, exports, module) {
    var tmpl = ['<header class="web-hd">',
        '        <div class="navbar">',
        '            <a class="back left">返回</a>',
        '            <p class="title">活动介绍</p>',
        '        </div>',
        '    </header>',
        '    <div class="web-bd">',
        '        <div class="textarea">',
        '            <textarea name="" id="" cols="30" rows="10">{%- intro %}</textarea>',
        '        </div>',
        '        <div class="btns padding">',
        '            <a class="btn success block">确定</a>',
        '        </div>',
        '    </div>'
    ].join("");

    var editIntroView = Backbone.SView.extend({
        tagName: "div",
        id: 'editIntroMain',
        className: 'mainview',
        template: _.template(tmpl),
        events: {
            'tap .back': 'goBack',
            'tap .btn.success': 'submit'
        },

        initialize: function(opts) {
        },
        render: function() {
            var data=this.model.toJSON();
            var htm = this.template(data);
            this.$el.html(htm);
            return this;
        },
        submit: function () {
            var val=this.$('textarea').val();
            if(!val) {
                alert('请输入内容');
                return;
            }
            this.model.set('intro', val);
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

    module.exports = editIntroView;

});