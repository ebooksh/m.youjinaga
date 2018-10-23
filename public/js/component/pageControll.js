// pageControll.js

define(function(require, exports, module) {
    var defOpts = {
        curListIndex: 0,
        listNum: 20,
        url: "",
        firstLanch: false,
        next: function() {},
        prev: function() {},
        success: function() {}
    };

    function compactUrl(url, opt) {
        var optStr = $.param(opt);
        if (url.lastIndexOf("?") != -1) {
            url += "&" + optStr;
        } else {
            url += "?" + optStr;
        }
        return url;
    };


    var PageControll = function(el, opts) {
        el = $(el);
        if (el.length < 1) throw new Error("el不存在");
        this.el = el;
        opts = $.extend({}, defOpts, opts);
        if (!opts.url) throw new Error("缺少url");
        this.opts = opts;
        (this.nextEl = el.find(".next"), this.nextEl.length<1) && (this.nextEl = this.createDom("next"));
        (this.prevEl = el.find(".prev"), this.prevEl.length<1) && (this.prevEl = this.createDom("prev"));
        this.init();
        if (opts.firstLanch) this.next();
    };
    PageControll.prototype.createDom = function (type) {
        var tmpl="", el;
        if(type==="next") {
            tmpl='<a style="display:none;" class="item next">下一页</a>';
            el=$(tmpl);
            this.el.find(".btns").append(el);
        }else if(type==="prev") {
            tmpl='<a style="display:none;" class="item prev">上一页</a>';
            el=$(tmpl);
            this.el.find(".btns").prepend(el);
        }
        return el;
    };
    PageControll.prototype.init = function() {
        var that = this;
        this.el.on("touchend", ".next", function() {
            that.next();
        }).on("touchend", ".prev", function() {
            that.prev();
        });
    };
    PageControll.prototype.getData = function(opts, extraOpts) {
        var that = this,
            success = function(resp) {
                if (resp.code != 1) {
                    alert(CodeKeyValue.getValue(resp.code));
                    return;
                }
                that.setBtnsVisiable(resp.data.length);
                opts.success(resp.data);
            };

        if (_.isObject(extraOpts)) {
            $.post(compactUrl(opts.url, {
                pageNum: opts.listNum,
                pageIndex: opts.curListIndex
            }), extraOpts, function(resp) {
                success(resp);
            }, "json");
        } else {
            $.getJSON(opts.url, {
                pageNum: opts.listNum,
                pageIndex: opts.curListIndex
            }, function(resp, status, xhr) {
                success(resp);
            });
        }
    };
    PageControll.prototype.next = function() {
        var opts = this.opts;
        opts.curListIndex++;
        this.getData(opts, this.extraOpts);
    };
    PageControll.prototype.prev = function() {
        var opts = this.opts;
        --opts.curListIndex <= 0 && (opts.curListIndex = 1);
        this.getData(opts, this.extraOpts);
    };
    PageControll.prototype.setBtnsVisiable = function(len) {
        var opts = this.opts,
            pageIndex = opts.curListIndex,
            pageNum = opts.listNum;
        if (pageIndex <= 1) this.prevEl.hide();
        else this.prevEl.show();
        if (len < pageNum) this.nextEl.hide();
        else this.nextEl.show();
    };
    PageControll.prototype.setExtraOpts = function(opts) {
        this.extraOpts = opts;
        return this;
    };
    PageControll.prototype.refresh = function() {
        this.opts.curListIndex=0;
        this.next();
        return this;
    };

    module.exports = PageControll;

});