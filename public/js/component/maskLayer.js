// maskLayer

define(function(require, exports, module) {
    var el,
        doc=document,
        nop=function(){},
        defOpts={
            style: null,
            innerHtml: null,
            clickCallback: nop,
            hideCallback: nop,
            showCallback: nop
        };

    var clickName="tap",
        transitionEndEve=function () {
            if("onwebkittransitionend" in window) {
                return "webkitTransitionEnd";
            }else if("ontransitionend" in window) {
                return "transitionEnd";
            }
        }();
    
    exports.show = function(opts) {
        opts || (opts={});
        !el && (el=$('<div id="maskLayer" class="mask">'), $("body").append(el));
        el.one(transitionEndEve, function () {
            opts.showCallback();
        });
        el.get(0).clientLeft; // 先：reflow 再：设置class
        el.addClass("in");

        opts=$.extend({}, defOpts, opts);
        opts.style && el.css(opts.style);
        opts.innerHtml && el.append('<div class="inner"></div>').html(opts.innerHtml);
        el.off(clickName).on(clickName, function () {
            opts.hideByMe || exports.hide(opts);
            opts.clickCallback();
        });
        // opts.showCallback.call(el, null);
    };
    exports.hide=function (opts) {
        if(!el) return;
        opts || (opts={});
        opts=$.extend({}, defOpts, opts);
        var success=function () {
            el.remove();
            el=null;
            opts.hideCallback(); 
        };

        if(opts.animation === false) {
            el.removeClass("in");
            success();
        }else{
            el.one(transitionEndEve, success);
            el.removeClass("in");
        }
    };

});