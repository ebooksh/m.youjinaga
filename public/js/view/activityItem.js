// activityItem.js

define(function(require, exports, module) {
    var ActivityModel = require("entity/activity");

    var tmpl = ['<a class="item-card" href="#activities/{%- _id %}">',
        '                        <img class="card-img" src="{%- cover %}" alt="">',
        '                        <div class="quote">',
        '                            <h5 class="quote-hd">{%- header %}</h5>',
        '                            <p class="quote-text">{% print(intro.length < 47 ? intro : (intro.substr(0, 47) + "...")) %}</p>',
        '                        </div>',
        '                    </a>'
    ].join("");

    var ActivityItem = Backbone.View.extend({
        tagName: "section",
        className: "item-card-wrapper",
        template: _.template(tmpl),

        render: function () {
            var attrs=this.model.toJSON();
            var htm=this.template(attrs);
            this.$el.html(htm);
            return this;   
        }
    });

    module.exports=ActivityItem;
})