// selectgear

define(function(require, exports, module) {
    var maskLayer = require('./maskLayer');

    function Base(el, option) {
        this.el = $(el);
        this.option = option;
        this.isOpen = false;
        this.type = option.type || "base";
        this.init();
    }
    Base.prototype.init = function(opt) {};
    Base.prototype.toggle = function() {
        this.isOpen ? this.close() : this.open();
    };
    Base.prototype.open = function() {
        var that = this,
            type = that.type,
            opt = that.option;
        if (that.isOpen) return;
        that.isOpen = true;
        this.el.one('tap', '[data-dismiss="' + type + '"]', $.proxy(this.close, this));
        var e = opt.relatedTarget ? $.Event('open:' + type, {
            relatedTarget: opt.relatedTarget
        }) : $.Event('open:' + type);
        this.el.trigger(e);

        maskLayer.show({
            hideByMe: true
        });
        that.el.show();
        that.el.get(0).clientLeft;
        that.el.addClass('in').one(Render.transitionEndEve, function() {
            var e = opt.relatedTarget ? $.Event('opened:' + type, {
                relatedTarget: opt.relatedTarget
            }) : $.Event('opened:' + type);
            that.el.trigger(e);
        });
    };
    Base.prototype.close = function() {
        var that = this,
            type = that.type,
            opt = that.option;
        if (!that.isOpen) return;
        that.isOpen = false;
        var e = opt.relatedTarget ? $.Event('close:' + type, {
            relatedTarget: opt.relatedTarget
        }) : $.Event('close:' + type);
        maskLayer.hide();
        that.el.removeClass('in').one(Render.transitionEndEve, function() {
            var e = opt.relatedTarget ? $.Event('closed:' + type, {
                relatedTarget: opt.relatedTarget
            }) : $.Event('closed:' + type);
            that.el.trigger(e).hide();
        });
    };
    Base.prototype.setOption = function(opt) {
        this.option = opt;
    };


    function Time(opt) {
        this.yealEl = opt.yealEl;
        this.monthEl = opt.monthEl;
        this.dayEl = opt.dayEl;
        this.init();
    }
    Time.prototype.init = function() {
        this.create();
        this.bindEvent();
    };
    Time.prototype.create = function() {
        this.createYeal()
            .createMonth()
            .createDay();
    };
    Time.prototype.loop = function(start, num, txt, actval) {
        var htm = '';
        while (num--) {
            if (start == actval) {
                htm += '<a class="item z-active" data-value="' + start + '">' + start + txt + '</a>';
            } else {
                htm += '<a class="item" data-value="' + start + '">' + start + txt + '</a>';
            }
            start++;
        }
        return htm;
    };
    Time.prototype.createYeal = function() {
        var list = $('<div class="items">');
        this.curYear = new Date().getFullYear();
        var startYear = this.curYear - 2;
        var htm = this.loop(startYear, 12, '年', this.curYear);
        list.html(htm).appendTo(this.yealEl);
        return this;
    };
    Time.prototype.createMonth = function() {
        var list = $('<div class="items">');
        this.curMonth = 3;
        var startMonth = 1;
        var htm = this.loop(startMonth, 12, '月', this.curMonth);
        list.html(htm).appendTo(this.monthEl);
        return this;
    };
    Time.prototype.createDay = function() {
        var list = $('<div class="items">');
        this.curDay = 3;
        var startDay = 1;
        var num = new Date(this.curYear, this.curMonth, 0).getDate(),
            htm = this.loop(startDay, num, '日', this.curDay);
        list.html(htm).appendTo(this.dayEl);
        return this;
    };
    Time.prototype.refreshDay = function() {
        var list = this.dayEl.children('.items');
        this.curDay = 3;
        var startDay = 1;
        var num = new Date(this.curYear, this.curMonth, 0).getDate(),
            htm = this.loop(startDay, num, '日', this.curDay);
        list.html(htm);
        return this;
    };
    Time.prototype.bindEvent = function() {
        var that = this;
        // $(dom).on('selectitem.selectgear')的时候又是区分命名空间的, 
        // 但是$(dom).trigger('selectitem.selectgear'),他会吧selectitem.selectgear作为整个事件名！！触发，而不是只触发selectgear空间上的selectitem事件
        this.yealEl.on('selectitem.selectgear', function(e) {
            var relatedTarget = e.relatedTarget;
            if (!relatedTarget) return;
            var val = relatedTarget.data('value');
            if (!val) return;
            that.curYear = parseInt(val);
            that.refreshDay();
        });
        this.monthEl.on('selectitem.selectgear', function(e) {
            var relatedTarget = e.relatedTarget;
            if (!relatedTarget) return;
            var val = relatedTarget.data('value');
            if (!val) return;
            that.curMonth = parseInt(val);
            that.refreshDay();
        });
    };
    Time.prototype.remove = function() {
        this.yealEl.off('selectitem.selectgear').html('');
        this.monthEl.off('selectitem.selectgear').html('');
        this.dayEl.html('');
    };


    function Selectgear(el, option) {
        option.type = "selectgear";
        Base.call(this, el, option);
    }
    Selectgear.prototype = function() {
        var F = function() {};
        F.prototype = Base.prototype;
        var res = new F();
        res.constructor = Selectgear;
        res.__parent__ = Base.prototype;
        return res;
    }();
    Selectgear.prototype.init = function(opt) {
        this.generateItem();
        this.bindEvent();
    };
    Selectgear.prototype.generateItem = function() {
        var cols = this.el.find('.col');
        this.timeManager = new Time({
            yealEl: cols.eq(0),
            monthEl: cols.eq(1),
            dayEl: cols.eq(2)
        });
    };
    Selectgear.prototype.bindEvent = function() {
        var that = this,
            type = this.type,
            doc = document,
            el = this.el;
        var itemHei = 25,
            topLimit = 50,
            btmLimitHei = 75,
            btmLimit,
            isStart,
            startY,
            distY,
            trfY,
            actEl;
        // 命名空间没有实际的作用，触发的时候不会区分空间，只能用来告诉我们是在哪个空间下
        el.on('touchstart.' + type, '.col', function(e) {
            var touch = e.touches[0];
            isStart = true;
            startY = touch.pageY;
            actEl = $(this).children('.items');
            btmLimit = -(actEl.height() - btmLimitHei);
            trf = getTrf();
            var style = actEl.get(0).style;
            style.webkitTransition = 'none';
            style.transition = 'none';
            $(doc.body).on("touchmove.cancel", function(e) {
                e.preventDefault();
            });
        }).on('touchmove.' + type, '.col', function(e) {
            if (!isStart || !actEl) return;
            var touch = e.touches[0];
            var nowY = touch.pageY;
            distY = nowY - startY;
            var temp = trf + distY;
            if ((distY < 0 && temp <= btmLimit) || (distY > 0 && temp >= topLimit))
                return;
            var style = actEl.get(0).style;
            style.webkitTransform = 'translateY(' + (trf + distY) + 'px)';
            style.transform = 'translateY(' + (trf + distY) + 'px)';

        }).on('touchend.' + type, '.col', function(e) {
            $(doc.body).off('touchmove.cancel');
            if (!isStart || !actEl) return;
            trf = getTrf();
            var index,
                items = actEl.find('.item');
            if (trf == 0) return;
            else if (trf < 0) {
                index = Math.ceil(Math.abs(trf) / itemHei) + 2;
                Math.abs(trf) % itemHei < itemHei / 2 && (index -= 1);
            } else if (trf > 0) {
                index = 2 - Math.ceil(trf / itemHei);
                trf % itemHei < itemHei / 2 && (index += 1);
            }
            items.removeClass('z-active');
            var offsetY = 50 - items.eq(index).addClass('z-active').position().top;
            var style = actEl.get(0).style;
            style.webkitTransition = '-webkit-transform ease .3s';
            style.transition = 'transform ease .3s';
            style.webkitTransform = 'translateY(' + offsetY + 'px)';
            style.transform = 'translateY(' + offsetY + 'px)';
            // 前面说过了trigger的问题，所以不能加命名空间
            var eve = $.Event('selectitem', {
                relatedTarget: items.eq(index)
            });
            $(this).trigger(eve);
        });

        function getTrf() {
            var trf = actEl.css("transform");
            var matchs = /translateY\((-?\d+)px\)/.exec(trf);
            matchs ? (trf = parseInt(matchs[1])) : (trf = 0);
            return trf;
        }
    };
    Selectgear.prototype.close = function() {
        var base = this.__parent__.close;
        // this.remove();
        base.call(this);
    };
    Selectgear.prototype.remove = function() {
        var type = this.type;
        this.el.off('touchstart.' + type, '.col')
            .off('touchmove.' + type, '.col')
            .off('touchend.' + type, '.col');
        this.timeManager.remove();
    }


    function Plugin(option) {
        $.each(this, function(index, item) {
            var oldopt;
            if (!option) option = {};
            else if (typeof option === 'string') {
                oldopt = option;
                option = {};
            }
            var obj;
            if (this.selectgearObj) {
                obj = this.selectgearObj;
                obj.setOption(option);
            } else {
                this.selectgearObj = new Selectgear(this, option);
                obj = this.selectgearObj;
            }
            // var obj = new Selectgear(this, option);
            if (oldopt) { // $(...).selectgear('close');
                obj[oldopt]();
            } else {
                obj.open();
            }
        });
    }

    $.fn.selectgear = Plugin;
    $(document).on('tap', '[data-toggle="selectgear"]', function() {
        var tar = $($(this).data("target"));
        if (tar.length < 1) return;
        var option = $(this).data('option');
        option ? (option = JSON.parse(option)) : (option = {});
        option.relatedTarget = this;
        Plugin.call(tar, option);
    });

});