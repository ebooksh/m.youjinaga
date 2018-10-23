// init.js

/*! Sea.js 2.3.0 | seajs.org/LICENSE.md */
!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return z++}function e(a){return a.match(C)[0]}function f(a){for(a=a.replace(D,"/"),a=a.replace(F,"$1/");a.match(E);)a=a.replace(E,"/");return a}function g(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||"/"===c?a:a+".js"}function h(a){var b=u.alias;return b&&w(b[a])?b[a]:a}function i(a){var b=u.paths,c;return b&&(c=a.match(G))&&w(b[c[1]])&&(a=b[c[1]]+c[2]),a}function j(a){var b=u.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(H,function(a,c){return w(b[c])?b[c]:a})),a}function k(a){var b=u.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=y(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charAt(0);if(I.test(a))c=a;else if("."===d)c=f((b?e(b):u.cwd)+a);else if("/"===d){var g=u.cwd.match(J);c=g?g[0]+a.substring(1):a}else c=u.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=j(a),a=g(a);var c=l(a,b);return c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c){var d=K.createElement("script");if(c){var e=y(c)?c(a):c;e&&(d.charset=e)}p(d,b,a),d.async=!0,d.src=a,R=d,Q?P.insertBefore(d,Q):P.appendChild(d),R=null}function p(a,b,c){function d(){a.onload=a.onerror=a.onreadystatechange=null,u.debug||P.removeChild(a),a=null,b()}var e="onload"in a;e?(a.onload=d,a.onerror=function(){B("error",{uri:c,node:a}),d()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&d()}}function q(){if(R)return R;if(S&&"interactive"===S.readyState)return S;for(var a=P.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return S=c}}function r(a){var b=[];return a.replace(U,"").replace(T,function(a,c,d){d&&b.push(d)}),b}function s(a,b){this.uri=a,this.dependencies=b||[],this.exports=null,this.status=0,this._waitings={},this._remain=0}if(!a.seajs){var t=a.seajs={version:"2.3.0"},u=t.data={},v=c("Object"),w=c("String"),x=Array.isArray||c("Array"),y=c("Function"),z=0,A=u.events={};t.on=function(a,b){var c=A[a]||(A[a]=[]);return c.push(b),t},t.off=function(a,b){if(!a&&!b)return A=u.events={},t;var c=A[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete A[a];return t};var B=t.emit=function(a,b){var c=A[a],d;if(c){c=c.slice();for(var e=0,f=c.length;f>e;e++)c[e](b)}return t},C=/[^?#]*\//,D=/\/\.\//g,E=/\/[^/]+\/\.\.\//,F=/([^:/])\/+\//g,G=/^([^/:]+)(\/.+)$/,H=/{([^{]+)}/g,I=/^\/\/.|:\//,J=/^.*?\/\/.*?\//,K=document,L=location.href&&0!==location.href.indexOf("about:")?e(location.href):"",M=K.scripts,N=K.getElementById("seajsnode")||M[M.length-1],O=e(n(N)||L);t.resolve=m;var P=K.head||K.getElementsByTagName("head")[0]||K.documentElement,Q=P.getElementsByTagName("base")[0],R,S;t.request=o;var T=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,U=/\\\\/g,V=t.cache={},W,X={},Y={},Z={},$=s.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};s.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=s.resolve(b[d],a.uri);return c},s.prototype.load=function(){var a=this;if(!(a.status>=$.LOADING)){a.status=$.LOADING;var c=a.resolve();B("load",c);for(var d=a._remain=c.length,e,f=0;d>f;f++)e=s.get(c[f]),e.status<$.LOADED?e._waitings[a.uri]=(e._waitings[a.uri]||0)+1:a._remain--;if(0===a._remain)return a.onload(),b;var g={};for(f=0;d>f;f++)e=V[c[f]],e.status<$.FETCHING?e.fetch(g):e.status===$.SAVED&&e.load();for(var h in g)g.hasOwnProperty(h)&&g[h]()}},s.prototype.onload=function(){var a=this;a.status=$.LOADED,a.callback&&a.callback();var b=a._waitings,c,d;for(c in b)b.hasOwnProperty(c)&&(d=V[c],d._remain-=b[c],0===d._remain&&d.onload());delete a._waitings,delete a._remain},s.prototype.fetch=function(a){function c(){t.request(g.requestUri,g.onRequest,g.charset)}function d(){delete X[h],Y[h]=!0,W&&(s.save(f,W),W=null);var a,b=Z[h];for(delete Z[h];a=b.shift();)a.load()}var e=this,f=e.uri;e.status=$.FETCHING;var g={uri:f};B("fetch",g);var h=g.requestUri||f;return!h||Y[h]?(e.load(),b):X[h]?(Z[h].push(e),b):(X[h]=!0,Z[h]=[e],B("request",g={uri:f,requestUri:h,onRequest:d,charset:u.charset}),g.requested||(a?a[g.requestUri]=c:c()),b)},s.prototype.exec=function(){function a(b){return s.get(a.resolve(b)).exec()}var c=this;if(c.status>=$.EXECUTING)return c.exports;c.status=$.EXECUTING;var e=c.uri;a.resolve=function(a){return s.resolve(a,e)},a.async=function(b,c){return s.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=y(f)?f(a,c.exports={},c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=$.EXECUTED,B("exec",c),g},s.resolve=function(a,b){var c={id:a,refUri:b};return B("resolve",c),c.uri||t.resolve(c.id,b)},s.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,x(a)?(c=a,a=b):c=b),!x(c)&&y(d)&&(c=r(""+d));var f={id:a,uri:s.resolve(a),deps:c,factory:d};if(!f.uri&&K.attachEvent){var g=q();g&&(f.uri=g.src)}B("define",f),f.uri?s.save(f.uri,f):W=f},s.save=function(a,b){var c=s.get(a);c.status<$.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=$.SAVED,B("save",c))},s.get=function(a,b){return V[a]||(V[a]=new s(a,b))},s.use=function(b,c,d){var e=s.get(d,x(b)?b:[b]);e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=V[d[f]].exec();c&&c.apply(a,b),delete e.callback},e.load()},t.use=function(a,b){return s.use(a,b,u.cwd+"_use_"+d()),t},s.define.cmd={},a.define=s.define,t.Module=s,u.fetchedList=Y,u.cid=d,t.require=function(a){var b=s.get(s.resolve(a));return b.status<$.EXECUTING&&(b.onload(),b.exec()),b.exports},u.base=O,u.dir=O,u.cwd=L,u.charset="utf-8",t.config=function(a){for(var b in a){var c=a[b],d=u[b];if(d&&v(d))for(var e in c)d[e]=c[e];else x(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),u[b]=c}return B("config",a),t}}}(this);

// 改变模版underscore的模版设置，因为后台使用的是ejs,也是使用<%%>形式的
_.templateSettings = {  
    evaluate : /\{%([\s\S]+?)\%\}/g,  
    interpolate : /\{%=([\s\S]+?)\%\}/g,  
    escape : /\{%-([\s\S]+?)%\}/g  
};

// core
Date.prototype.parse=function (pattern) {
    var y = this.getFullYear();
    var m = this.getMonth() + 1;
    var d = this.getDate();

    var res = pattern;
    res = res.replace("yyyy", y);
    res = res.replace("mm", m);
    res = res.replace("dd", d);

    return res;
};

// 路由对象
// 如果是使用左滑，右滑来控制页面切换的话，返回时的滑动方向就很怪，不好控制
var AppRooter = Backbone.Router.extend({
    /*如果既有#url这种hash形式的和/publish这种真实的url怎么办*/
    routes: {
        "": "loadIndex",
        "browser": "loadIndexBrowser",
        "recommend": "loadIndex",
        "activities/:query": "loadInfo",
        "publish(/:query)": "loadPublish"
    },

    initialize: function(opts) {
        this.indexView = null;
        this.infoView = null;
    },
    slideToAppend: function (view) {
        var curView=this.curView;
        if(view===curView) return;
        if(view.isOld) {
            $("body").append(view.$el);
        }else {
            $("body").append(view.render().$el);
            view.isOld=true;
        }
        if(curView) {
            curView.hide();
            curView.once("out.success", function () {
               curView.detach(); // 从dom树中移除
            });
            view.show(); // 由视图的show方法控制进入的方式？？
        }
        this.curView=view; // 需要等到leftIn的动画结束后再设置吗？？不用，因为前面保存了curView这个暂时的对象
    },
    fadeToAppend: function (view) {
        var curView=this.curView;
        if(view===curView) return;
        if(!view.isOld) {
            view.render();
            view.isOld=true;
        }
        if(curView) {
            curView.once("out.success", function () {
                curView.detach();
            });
            curView.fadeOut();
        }
        $("body").append(view.$el);
        this.curView=view;
    },


    // load
    loadIndex: function() {
        var that = this,
            curView = that.curView;
        seajs.use("view/index", function(index) {
            if(!that.indexView) that.indexView=new index();
            that.fadeToAppend(that.indexView);
            that.indexView.initSubView("recommend");
        });
    },
    loadIndexBrowser: function() {
        var that = this,
            curView = that.curView;
        seajs.use("view/index", function(index) {
            if(!that.indexView) that.indexView=new index();
            that.fadeToAppend(that.indexView);
            that.indexView.initSubView("browser");
        });
    },

    // info
    loadInfo: function (activityId) {
        var that=this,
            curView=this.curView;
        seajs.use("view/info", function(info) {
            if(!that.infoView) that.infoView=new info();
            that.infoView.setCurActivityId(activityId);
            that.fadeToAppend(that.infoView);
        });
    },

    // publish, 是跳转到另外一张页面去的，所以curview为null
    // 如何有activityId则为更新，暂时不做
    loadPublish: function (activityId) {
        var that=this,
            curView=this.curView;
        seajs.use("view/publish", function (publish) {
            var temp=new publish({activityId: activityId});
            that.fadeToAppend(temp);
        });
    }
});

// 浏览器渲染特征
var Render = function() {
    var render = function() {
        var arr = ["OT", "MozT", "webkitT", "msT", "t"],
            len = arr.length,
            domStyle = document.body.style;

        for (var i = 0; i < len; i++) {
            var temp = arr[i] + "ransition";
            if (temp in domStyle) {
                return arr[i].substr(0, arr[i].length - 1);
            }
        }

        return false;
    }();

    var transitionEndEve = function() {
        if (render === false) return false;
        if (render !== "") {
            // @ques: 检测时都是小写onwebkittansitionend，绑定时又变成"webkitTansitionEnd"
            var res = render + "TransitionEnd";
            if (("on" + res).toLowerCase() in window) return res;
        } else {
            if ("ontransitionend" in window) return "transitionEnd";
        }
        return false;
    }();

    return {
        render: render,
        transitionEndEve: transitionEndEve
    };
}();

// 自定义带视图切换效果的backbone视图基类
// el必须已经添加到dom树中了
Backbone.SView = Backbone.View.extend({
    leftOut: function(opt) {
        opt || (opt={});
        var defOpt = {
            css: {
                beginX: 0,
                beginY: 0,
                endX: -100,
                endY: 0
            },
            interval: 330,
            before: function() {
                var bx = opt.css.beginX,
                    by = opt.css.beginY;
                var $el=this.$el;
                var style=$el.get(0).style;
                style.webkitTransform="translate(" + bx + "px, " + by + "px)";
                style.transform="translate(" + bx + "px, " + by + "px)";
                style.zIndex=98;
            },
            success: function() {
                this.$el.hide();
            }
        };
        _.extend(opt, defOpt);
        this.slip("left-out", opt);
    },
    leftIn: function(opt) {
        opt || (opt={});
        var offsetX = this.$el.parent().get(0).clientWidth;
        var defOpt = {
            css: {
                beginX: offsetX,
                beginY: 0,
                endX: 0,
                endY: 0
            },
            interval: 330,
            before: function() {
                var bx = opt.css.beginX,
                    by = opt.css.beginY;
                var $el=this.$el;
                var style=$el.get(0).style;
                style.webkitTransform="translate(" + bx + "px, " + by + "px)";
                style.transform="translate(" + bx + "px, " + by + "px)";
                style.zIndex=99;
                $el.show();
            },
            success: function() {}
        };
        _.extend(opt, defOpt);
        this.slip("left-in", opt);
    },
    downIn: function (opt) {
        opt || (opt={});
        var defOpt = {
            css: {
                beginX: 0,
                beginY: window.innerHeight,
                endX: 0,
                endY: 0
            },
            interval: 330,
            before: function() {
                var bx = opt.css.beginX,
                    by = opt.css.beginY;
                var $el=this.$el;
                var style=$el.get(0).style;
                style.webkitTransform="translate(" + bx + "px, " + by + "px)";
                style.transform="translate(" + bx + "px, " + by + "px)";
                style.zIndex=99;
                $el.show();
            },
            success: function() {}
        };
        _.extend(opt, defOpt);
        this.slip("down-in", opt);
    },
    downOut: function (opt) {
        opt || (opt={});
        var defOpt = {
            css: {
                beginX: 0,
                beginY: 0,
                endX: 0,
                endY: window.innerHeight
            },
            interval: 330,
            before: function() {
                var bx = opt.css.beginX,
                    by = opt.css.beginY;
                var $el=this.$el;
                var style=$el.get(0).style;
                style.webkitTransform="translate(" + bx + "px, " + by + "px)";
                style.transform="translate(" + bx + "px, " + by + "px)";
                style.zIndex=98;
            },
            success: function() {
                this.$el.hide();
            }
        };
        _.extend(opt, defOpt);
        this.slip("down-out", opt);
    },
    slip: function(direction, opt) {
        this.slipInit(direction, opt).transform(direction, opt);
        // this.slipInit(direction, opt);
    },
    transform: function(direction, opt) {
        var $el = this.$el;
        var ex = opt.css.endX,
            ey = opt.css.endY;
        var t = opt.interval / 1000;

        // 为什么zepto.css({}),在Safari中失效？？！
        var style=$el.get(0).style;
        // 即使是之前元素并没有设置transition，也可以再改变属性的同时设置transition也是可以的（包括使用class）
        style.webkitTransition="-webkit-transform ease " + t + "s";
        style.transition="transform ease " + t + "s";
        style.webkitTransform="translate(" + ex + "px, " + ey + "px)";
        style.transform="translate(" + ex + "px, " + ey + "px)";
    },
    slipInit: function(desc, opt) {
        var dire=desc.split("-")[0], // 方向
            type=desc.split("-")[1]; // 进入还是退出
        var that = this;
        var t = opt.interval / 1000,
            $el = that.$el,
            success = function() {
                // $el.css("z-index", null);
                $el.get(0).style.cssText="";
                opt.success.call(that, null);
                type === "in" ? that.trigger("in.success") : that.trigger("out.success");
            };
        if (!Render.transitionEndEve) {
            setTimeout(success, opt.interval);
        } else {
            $el.one(Render.transitionEndEve, success);
        }

        // 上面绑定了transitionend事件了，如果执行before时也发生了transiion效果则也会执行transitionend，所以就会在执行sucess回调时把style给清除了
        opt.before.call(that);
        type === "in" ? that.trigger("in.before") : that.trigger("out.before");
        // $el.get(0).clientLeft;
        return this;
    },

    /*新视图在底部，旧视图在上面，旧视图进行渐变*/
    fadeOut: function () {
        var that=this;
        var $el=this.$el,
            success=function () {
                $el.removeClass("fade out");
                that.trigger("out.success");
            };
        $el.addClass("fade out");
        $el.one(Render.transitionEndEve, success);
        that.trigger("out.before");
    },

    detach: function () {
        this.$el.remove();
        return this;
    },
    show: function(openEffect) {
        this.leftIn();
    },
    hide: function(openEffect) {
        this.leftOut();
    }
});

// 错误提示code－value
var CodeKeyValue = {
    "0": "系统出现错误，请稍候重试",
    getValue: function(code) {
        var res = this[code];
        if (!res) res = this["0"];
        return res;
    }
};


function startRoute() {
    window.appRouter = new AppRooter();
    // 没有使用pushstate的方式因为：
    // 除了首页，其他的URL也会变成真实的，如果刷新页面，就会向后台请求这个地址，如果后台不做处理就会404
    Backbone.history.start();
}

$(function() {
    startRoute();
});