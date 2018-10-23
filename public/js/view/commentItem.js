// commentItem.js

define(function(require, exports, module) {
    var Comment = require('entity/comment').Comment;

    var tmpl = ['<div class="person">',
        '                            <img src="{%- userId.avatar %}" alt="">',
        '                            <span>{%- userId.username %}</span>',
        '                            <span class="date">{%- time.parse("yyyy-mm-dd") %}</span>',
        '                        </div>',
        '                        <div class="content">',
        '                            <p>{%- content %}</p>',
        '                        </div>'
    ].join("");

    var ActivityItem = Backbone.View.extend({
        tagName: "div",
        className: "item",
        template: _.template(tmpl),

        render: function() {
            var attrs = this.model.toJSON();
            var htm = this.template(attrs);
            this.$el.html(htm);
            return this;
        }
    });

    module.exports = ActivityItem;
});