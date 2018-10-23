var express = require('express');
var _ = require('underscore');
var Activity = require('../models/activity');
var JsonResult = require('../utils/jsonResult');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index.html', {
        title: 'Express'
    });
});

router.get('/getRecommendList', function(req, res, next) {
    var query = req.query,
        num = parseInt(query.pageNum),
        pageIndex = parseInt(query.pageIndex);
    var queryCmd = Activity.find({}).sort({
        uploadTime: "desc"
    }).skip((pageIndex - 1) * num).limit(num);
    queryCmd.exec(function(err, results) {
        if (err) {
            res.json(JsonResult.fail());
        } else {
            res.json(JsonResult.succ(results));
        }
    });
});

router.all('/getBrowserList', function(req, res, next) {
    var query = req.query,
        num = parseInt(query.pageNum),
        pageIndex = parseInt(query.pageIndex);
    var queryCmd;
    var tags = req.body.tags;
    tags ? (tags = tags.split(/[^\w]/)) : (tags = []);
    if(tags.length>0) {
        Activity.find({}, function(err, results) {
            if (err) {
                res.json(JsonResult.fail());
            } else {
                var temp = _.filter(results, function (item, index) {
                    // 如果该记录的的标签数组包含tags就选中
                    if(_.intersection(item.get('tag'), tags).length === tags.length) return true;
                    else return false;
                });
                var begin=(pageIndex-1)*num,
                    end=begin+num;
                res.json(JsonResult.succ(temp.slice(begin, end)));
            }
        });
    }else{
        queryCmd=Activity.find({}).skip((pageIndex-1)*num).limit(num);
        queryCmd.exec(function (err, results) {
            if(err) {
                res.json(JsonResult.fail());
            }else {
                res.json(JsonResult.succ(results));
            }
        })
    }
});

router.post('/add', function(req, res, next) {
    var num = 20,
        startTime = new Date();
    while (num--) {
        var opt = getOpts(num);
        var nAct = new Activity(opt);
        nAct.save(function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function getOpts(num) {
        var res = {};
        res.email = "xxxxxxxxx@qq.com".replace(/x/g, function() {
            return Math.floor(Math.random() * 10);
        });
        res.header = "测试: " + num;
        res.endTime = addDay(startTime, num);
        res.link = "";
        res.intro = createIntro();
        res.cover = "img/activities/" + num + ".jpg";
        return res;
    }

    function addDay(time, num) {
        var resTime = new Date(time.getTime());
        var date = resTime.getDate() + num;
        resTime.setDate(date);
        return resTime;
    }

    function createIntro() {
        var str = "我看过的各种视频教程绝对有几千部，当时迷恋网赚的时候每天从早到晚，当然那时候身为一个屌丝我是没钱买付费教程的，到处下载各种免费的。这中间有个窍门，就是免费的教程其实是最好的，很多人为什么要录制免费的，因为他们要吸引付费用户，对于这些人，免费视频教程的要求其实是非常高的。";
        var lib = [].slice.call(str);
        lib.sort(function(a, b) {
            var b = Math.random() - 0.5;
            return b;
        });
        return lib.join("");
    }
});


// 静态页面
// ============================================================
router.get('/info', function(req, res, next) {
    res.render('info.html', {
        title: 'Express'
    });
});

router.get('/list', function(req, res, next) {
    res.render('list.html', {
        title: 'Express'
    });
});

router.get('/search', function(req, res, next) {
    res.render('search.html', {
        title: 'Express'
    });
});

router.get('/selectTag', function(req, res, next) {
    res.render('selectTag.html', {
        title: 'Express'
    });
});

router.get('/editIntro', function(req, res, next) {
    res.render('editIntro.html', {
        title: 'Express'
    });
});

module.exports = router;