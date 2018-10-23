// index.js

define(function(require, exports, module) {
    var Activity = require("../entity/activity"),
        ActivityItemView = require("./activityItem"),
        SearchView = require("./search"),

        slide = require("component/slide");
        maskLayer = require("component/maskLayer"),
        PageControll = require("component/pageControll");

    var IndexView = Backbone.SView.extend({
        tagName: "div",
        id: "indexTmpl",
        className: "mainview",
        events: {
            "tap .menu-btn": "showAside",
            "tap .sup-nav-item": "switchSubView",
            "tap .search-btn": "showSearchView",
            "tap .login-btn": "asideNav",
            "click .login-btn": "disabledRedirect",
            "tap .menu-item": "menuSelected"
        },
        template: _.template($('#indexTmpl').html()),

        initialize: function(opts) {
            this.browserView = new BrowserView();
            this.recommendView = new RecommendView();
            this.browserView.notRender = true;
            this.recommendView.notRender = true;
        },
        render: function() {
            var htm=this.template();
            this.$el.html(htm);
            return this;
        },
        menuSelected: function (e) {
            var tar=$(e.currentTarget);
            tar.parent().children().removeClass("z-active");
            tar.addClass("z-active");
            // this.hideAside();
        },
        disabledRedirect: function (e) {
            e.preventDefault();
        },
        showSearchView: function () {
            var that=this;
            var searchView = new SearchView();
            searchView.on("in.success", function () {
                that.$el.hide();
            }).on("out.before", function () {
                that.$el.show();
            }).on("out.success", function () {
                searchView.remove();
            });
            $("body").append(searchView.render().$el);
            searchView.show();
        },
        showAside: function(e) {
            var asideEl = this.$(".web-aside");
            maskLayer.show({
                clickCallback: function() {
                    asideEl.removeClass("in");
                },
                hideCallback: function () {
                    asideEl.removeClass("visible");
                }
            });
            asideEl.addClass("visible in");
        },
        hideAside: function () {
            var asideEl = this.$(".web-aside");
            maskLayer.hide({
                animation: false,
                hideCallback: function () {
                    asideEl.removeClass("visible in");
                }
            });
        },
        asideNav: function (e) {
            var href=$(e.target).attr("href");
            appRouter.navigate(href, {trigger: true});
            this.hideAside();
        },
        switchSubView: function(e) {
            var type = $(e.currentTarget).data("type");
            // if(type===this.subView) return;
            this.subView=type;
            appRouter.navigate(type, {trigger: false});
            this._switchSubView(type, true);
        },
        initSubView: function (type) {
            type || (type="recommend");
            if(type===this.subView) return;
            this.subView=type;
            this._switchSubView(type);
        },
        _switchSubView: function (type, openEffect) {
            openEffect || (openEffect=false);
            this.$(".sup-nav-item").removeClass("z-active");
            this.$(".menu .menu-item").removeClass("z-active");
            if (type === "recommend") {
                this.$('[data-type="recommend"]').addClass('z-active');
                this.$('.menu [data-type="recommend"]').addClass('z-active');
                this.browserView.hide(openEffect);
                if(this.recommendView.notRender) {
                    this.recommendView.notRender=false;
                    this.$(".web-bd").append(this.recommendView.render().$el);
                }
                this.recommendView.show(openEffect);
            } else if (type === "browser") {
                this.$('[data-type="browser"]').addClass('z-active');
                this.$('.menu [data-type="browser"]').addClass('z-active');
                this.recommendView.hide(openEffect);
                if (this.browserView.notRender) {
                    this.browserView.notRender=false;
                    this.$(".web-bd").append(this.browserView.render().$el);
                }
                this.browserView.show(openEffect);
            }
        }
    });

    var recommendTmpl = ['<div class="bnr-scroll-wrapper">',
        '                <div class="banners">',
        '                    <div class="iscroller">',
        '                        <a class="banner-item" href="./info">',
        '                           <img class="banner-img" src="http://qstatic.zuimeia.com/img/covers/cld/2015071513271882535_640x360.jpg" alt="">',
        '                        </a>',
        '                        <a class="banner-item" href="./info">',
        '                           <img class="banner-img" src="http://www.99danji.com/upload/20127/2012071940647033.jpg" alt="">',
        '                        </a>',
        '                        <a class="banner-item" href="./info">',
        '                           <img class="banner-img" src="http://pic.ku.duowan.com/y/1208/347/0y120851298930347_0.JPG" alt="">',
        '                        </a>',
        '                    </div>',
        '                </div>',
        '            </div>',
        '            <div class="contents">',
        '            </div>',
        '            <div class="page-controll">',
        '                <div class="btns right">',
        '                </div>',
        '            </div>'
    ].join("");
    var RecommendView = Backbone.SView.extend({
        tagName: "div",
        id: "recommendV",
        template: _.template(recommendTmpl),

        render: function() {
            var htm = this.template(),
                that = this;
            this.$el.html(htm);
            this.contentsEl = this.$(".contents");

            this.bannerScroll();

            this.pageControll = new PageControll(this.$(".page-controll"), {
                curListIndex: 0,
                listNum: 10,
                url: "./getRecommendList",
                firstLanch: true,
                success: function(list) {
                    if (list.length < 1) {
                        that.contentsEl.html('<p style="text-align: center; margin:15px;">没有更多内容<p>');
                    } else {
                        var items = $.map(list, function(item, index) {
                            var m = new Activity(item),
                                v = new ActivityItemView({
                                    model: m
                                });
                            return v.render().$el;
                        });
                        // 不使用each为了不是一个一个添加dom,使用map返回一个数组，整体添加
                        that.contentsEl.html("").append(items);
                    }
                }
            });
            return this;
        },
        bannerScroll: function () {
            var wid=window.innerWidth;
            this.$(".banners").slide({
                cell: ".banner-item",
                itemWidth: wid
            });
        },
        show: function(openEffect) {
            if(openEffect) {
                this.leftIn();
            }else {
                this.$el.show();
            }
        },
        hide: function(openEffect) {
            if(openEffect) {
                this.leftOut();
            }else {
                this.$el.hide();
            }
        }
    });

    var browserTmpl = ['<div class="sub-nav">',
        '            <div class="nav">',
        '            </div>',
        '        </div>',
        '        <div class="contents">',
        '        </div>',
        '        <div class="page-controll">',
        '            <div class="btns right">',
        '            </div>',
        '        </div>'
    ].join("");
    var BrowserView = Backbone.SView.extend({
        tagName: "div",
        id: "browserV",
        template: _.template(browserTmpl),
        events: {
            "tap .morebtn": "toggleMoreTag",
            "tap .sub-nav-item": "filterByTag"
        },

        initialize: function(opts) {

        },
        renderTagDom: function() {
            var navEl = this.navEl,
                itemTmpl='<a data-tagid="{%- _id %}" class="sub-nav-item item">{%- tagName %}</a>',
                itemTmplFunc=_.template(itemTmpl);
            $.getJSON("/commons/tags", function(resp, status, xhr) {
                if (resp.code != 1) return;
                var list=resp.data;
                var topEl=$('<div class="top">'),
                    btmEl;
                var temp, num=3;
                temp=itemTmplFunc({_id: -1, tagName: '全部'});
                if (list.length > 3) {
                    while(num--) {
                        temp+=itemTmplFunc(list.shift());
                    }
                    temp+='<a class="item morebtn">更多<i class="icon icon-chevron-down icon-small"></i></a>';
                    topEl.html(temp);

                    temp="";
                    btmEl=$('<div class="btm z-hide">');
                    for(var i=0, len = list.length; i<len; i++) {
                        temp+=itemTmplFunc(list[i]);
                    }
                    btmEl.html(temp);
                }else{
                    for(var i=0, len = list.length; i<len; i++) {
                        temp+=itemTmplFunc(list[i]);
                    }
                    topEl.html(temp);
                }
                topEl.children().first().addClass("z-active all");
                btmEl.length>0 ? (navEl.append(topEl), navEl.append(btmEl)) : navEl.append(topEl);
            });
        },
        render: function() {
            var htm = this.template(),
                that = this;
            this.$el.html(htm);
            this.contentsEl = this.$(".contents");
            this.navEl = this.$(".nav");

            this.renderTagDom();

            this.pageControll = new PageControll(this.$(".page-controll"), {
                curListIndex: 0,
                listNum: 10,
                url: "./getBrowserList",
                firstLanch: true,
                success: function(list) {
                    if (list.length < 1) {
                        that.contentsEl.html('<p style="text-align: center; margin:15px;">没有更多内容<p>');
                    } else {
                        var items = $.map(list, function(item, index) {
                            var m = new Activity(item),
                                v = new ActivityItemView({
                                    model: m
                                });
                            return v.render().$el;
                        });
                        that.contentsEl.html("").append(items);
                    }
                }
            });
            return this;
        },
        filterByTag: function(e) {
            var $tar=$(e.target);
            if($tar.data('tagid') == "-1") {
                this.$('.sub-nav-item').removeClass('z-active');
                $tar.addClass('z-active');
                this.pageControll.setExtraOpts(null).refresh();
            }else {
                this.navEl.find('.all').removeClass('z-active');
                var tagEls = this.$(".sub-nav-item.z-active");
                if(tagEls.length <= 1) {
                    $tar.addClass('z-active');
                }else{
                    $tar.toggleClass('z-active');
                }
                tagEls = this.$(".sub-nav-item.z-active");

                var _tags = $.map(tagEls, function(item, index) {
                    return $(item).data("tagid");
                });
                var tagsStr=_tags.join('-');

                this.pageControll.setExtraOpts({
                    tags: tagsStr
                }).refresh();
            }
        },
        show: function(openEffect) {
            if(openEffect) {
                this.leftIn();
            }else {
                this.$el.show();
            }
        },
        hide: function(openEffect) {
            if(openEffect) {
                this.leftOut();
            }else {
                this.$el.hide();
            }
        },
        toggleMoreTag: function(e) {
            this.navEl.find(".btm").toggleClass("z-hide");
            $(e.currentTarget).toggleClass("z-active");
        }
    });

    module.exports = IndexView;

});