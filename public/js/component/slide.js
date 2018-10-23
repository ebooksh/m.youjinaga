// slide

define(function(require, exports, module) {
    var defopt = {
        cell: "",
        interval: .5,
        auto: false
    };

    $.fn.slide = function(opt) {
        opt=$.extend({}, defopt, opt);
        var scroller=this.children().first();
        var cells = scroller.find(opt.cell);
        if(cells.length<1) return;
        var that=this;

        var itemwid=opt.itemWidth || that.get(0).clientWidth || 320;
        scroller.width(itemwid*cells.length).css("position", "relative");
        cells.width(itemwid);
        opt.itemwid=itemwid;

        cells.first().addClass("z-active");
        bindEvent.call(that, scroller, cells, opt);
        runAnim.call(that, scroller, cells, opt, 0);

        // $(window).on("load", function () {
        //     var itemwid=opt.itemWidth || that.get(0).clientWidth || 320;
        //     scroller.width(itemwid*cells.length).css("position", "relative");
        //     cells.width(itemwid);
        //     opt.itemwid=itemwid;

        //     cells.first().addClass("z-active");
        //     bindEvent.call(that, scroller, cells, opt);
        //     runAnim.call(that, scroller, cells, opt, 0);
        // });
    };

    function runAnim (scroller, cells, opt, beginOffX) {
        if(!opt.auto) return;
        if(this.animTimer) {
            clearTimeout(this.animTimer);
            this.animTimer=null;
        }
        var style=scroller.get(0).style;
        var offXArr=$.map(cells, function (item, index) {
            return -$(item).position().left;
        });
        var len=cells.length;
        var startIndex=offXArr.indexOf(beginOffX);
        startIndex == -1  && (startIndex=0);

        var that=this;
        var loop = function () {
            startIndex=(startIndex+1)%len;
            style.webkitTransition="all ease "+opt.interval+"s";
            style.transition="all ease "+opt.interval+"s";
            style.webkitTransform="translateX("+(offXArr[startIndex])+"px)";
            style.transform="translateX("+(offXArr[startIndex])+"px)";
            that.animTimer=setTimeout(loop, 2000);

            cells.removeClass("z-active");
            cells.eq(startIndex).addClass("z-active");
        };
        setTimeout(loop, 2000);
    }

    function clearAnim () {
        if(this.animTimer) {
            clearTimeout(this.animTimer);
            this.animTimer=null;
        }
    }

    function bindEvent (scroller, cells, opt) {
        var sx, offsetX, distX,
            isDisabled=false,
            that=this,
            style=scroller.get(0).style,
            curPage=null,
            nextPage=null,
            isTouching=false;

        var timer=null;

        this.on("touchstart", function (e) {
            if(isDisabled) return;
            if(timer) {
                clearTimeout(timer);
                timer=null;
            }
            curPage=cells.filter(".z-active");
            clearAnim.call(that);
            isTouching=true;
            nextPage=null;
            var touch=e.touches[0];
            sx=touch.pageX;
            offsetX=-curPage.position().left;

            $(document.body).on("touchmove.cancel", function (e) {
                e.preventDefault();
            });
        }).on("touchmove", function (e) {
            if(!isTouching || isDisabled) return;
            var touch=e.touches[0];
            var actPage;
            var cx=touch.pageX
            distX=cx-sx;
            if(distX>0) {
                actPage=curPage.prev();
            }else {
                actPage=curPage.next();
            }
            if(actPage.length<1) return;
            style.transition=null;
            style.webkitTransition=null;
            style.webkitTransform="translateX("+(offsetX+distX)+"px)";
            style.transform="translateX("+(offsetX+distX)+"px)";
            nextPage=actPage;
        }).on("touchend", function (e) {
            if(isDisabled) return;
            $(document.body).off("touchmove.cancel");
            if(isTouching && nextPage && nextPage.length>0) {
                isTouching=false;
                style.transition="all ease "+opt.interval+"s";
                style.webkitTransition="all ease "+opt.interval+"s";

                if(Math.abs(distX) < opt.itemwid/2) {
                    style.webkitTransform="translateX("+(offsetX)+"px)";
                    style.transform="translateX("+(offsetX)+"px)";
                }else {
                    curPage.removeClass("z-active");
                    nextPage.addClass("z-active");
                    curPage=nextPage;
                    offsetX=-curPage.position().left;
                    style.webkitTransform="translateX("+(offsetX)+"px)";
                    style.transform="translateX("+(offsetX)+"px)";
                }

                scroller.one(Render.transitionEndEve, function (e) {
                    timer=setTimeout(function () {
                        runAnim.call(that, scroller, cells, opt, offsetX);
                    },1000);
                    isDisabled=false;
                });
            }else {
                timer=setTimeout(function () {
                    runAnim.call(that, scroller, cells, opt, offsetX);
                },1000);
                // runAnim.call(that, scroller, cells, opt, offsetX);
            }
        });
    }

});