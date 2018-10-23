// search.js

define(function(require, exports, module) {
    var Activity = require('../entity/activity'),
        ActivityItemView = require('./activityItem'),
        InfoView = require('./info');
    var util=require('../component/util'),
        localDbUitl=util.localDbUitl,
        DelayUtil=util.DelayUtil;

    var REARCHRECORD='local-searchRecord';
    var SEARCHURL='/commons/search';

    function getSearchData (url, word, callback) {
        $.getJSON(url, {keyword: word}, function (resp, status, xhr) {
            if(resp.code!=1) {
                console.log(resp.msg);
            }else {
                callback(resp.data);
            }
        })
    }

    var SearchView = Backbone.SView.extend({
        tagName: "div",
        className: "mainview search-box",
        events: {
            'tap .clear': 'clearRecord',
            'tap .cancel': 'hide',
            'input .text': 'search',
            'tap .record-item': 'selectRecord',
            'click .item-card[href]': 'disabledRedirect',
            'tap .item-card[href]': 'showInfoView'
        },
        template: _.template($('#searchTmpl').html()),

        initialize: function (opt) {
            
        },
        render: function () {
            var _records=localDbUitl.get(REARCHRECORD) || [];
            var htm=this.template({records: _records});
            this.$el.html(htm);
            this.resultsEl=this.$('.results');
            // this.recordEl=this.$('.history-box .list');
            return this;
        },
        disabledRedirect: function (e) {
            e.preventDefault();
        },
        showInfoView: function (e) {
            var $el=this.$el;
            var href=$(e.currentTarget).attr('href');
            if(!href) return;
            var infoView = new InfoView();
            infoView.setCurActivityId(href.split('/')[1]);
            infoView.registerGoBack(function () {
                this.once('out.success', function () {
                    infoView.remove();
                    infoView=null;
                }).once('out.before', function () {
                    $el.show();
                });
                this.fadeOut();
            });
            $("body").append(infoView.render().$el);
            infoView.once('in.success', function () {
               $el.hide(); 
            });
            infoView.leftIn();
        },
        selectRecord: function (e) {
            var val=$(e.target).text().trim();
            this.$('.text').val(val).trigger('input');
        },
        search: function (e) {
            var that=this;
            var val=$(e.target).val().trim();
            if(!val) return;
            that.delayDo(function () {
                that.getSearchData(SEARCHURL, val, that.searchCallback);
            }, 400);
        },
        searchCallback: function (list, keyword) {
            var resultsEl=this.resultsEl;
            this.$(".history-box").remove();
            resultsEl.html("");
            $.each(list, function (index, item) {
                var m=new Activity(item),
                    v=new ActivityItemView({model: m});
                resultsEl.append(v.render().$el);
            });
            localDbUitl.push(REARCHRECORD, keyword);
        },
        getSearchData: function (url, word, callback) {
            var that=this;
            $.getJSON(url, {keyword: word}, function (resp, status, xhr) {
                if(resp.code!=1) {
                    console.log(resp.msg);
                }else {
                    callback.call(that, resp.data, word);
                }
            });
        },
        clearRecord: function () {
            localDbUitl.remove(REARCHRECORD);
            this.$(".history-box").remove();
        },
        hide: function () {
            this.downOut();
        },
        show: function () {
            this.downIn();
        }
    });
    _.extend(SearchView.prototype, DelayUtil);

    module.exports = SearchView;

});