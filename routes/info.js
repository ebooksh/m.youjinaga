/*
 *  模拟restful请求
 *  router.route('/books/:bookId?')
 *      .get(function (req, res) {
 *          // ...
 *      })
 *      .put(function (req, res) {
 *          // ...
 *      })
 *      .post(function (req, res) {
 *          // ...
 *      })
 *      .delete(function (req, res) {
 *          // ...
 *      });
*/

// 依赖
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var JsonResult = require('../utils/jsonResult');
var fs = require('fs');
var path = require('path');
// 模型
var Activity = require('../models/activity');
var Tag = require('../models/tag');
var Comment = require('../models/comment');

var baseurl = path.join(__dirname, '../public');

function copyFile(src, dst) {
    fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

function parseBody (body) {
    body.tag = _.map(body.tag, function(item, index) {
        if (_.isObject(item)) {
            return item._id;
        } else if (_.isString(item)) {
            return item;
        }
    });
    if (body.cover && body.cover.indexOf('uploads/') != -1) {
        var src = path.join(baseurl, body.cover),
            filename = path.basename(src),
            finalurl = path.join('img/activities', filename),
            dst = path.join(baseurl, finalurl);
        copyFile(src, dst);
        body.cover = finalurl;
    }
}

// 创建一个新模型
router.post('/', function(req, res, next) {
    var body = req.body;
    parseBody(body);
    var temp = new Activity(body);
    temp.save(function(err, model) {
        if (err) {
            res.json(null);
        } else {
            res.json(model);
        }
    })
});

// 模拟put请求
router.route('/:activityId').put(function(req, res) {
    var body = req.body;
    var oldtag=body.tag;
    parseBody(body);
    // Activity.findById(req.params.activityId, function (err, result) {
    //     temp.save(function(err, model) {
    //         result.email=body.email
    //         ...
    //         
    //         if (err) {
    //             res.json(null);
    //         } else {
    //             res.json(model);
    //         }
    //     })
    // });
    
    // 默认model返回的还是没有改变之前的，所以要设置{new:true}
    Activity.findOneAndUpdate({
        _id: req.params.activityId
    }, body, {new: true}, function (err, model) {
        if(err) {
            res.json(null);
        }else {
            model.tag=oldtag;
            res.json(model); 
        }
    });
    
});


// 返回一个活动模型
router.get('/:activityId', function(req, res, next) {
    var activityId = req.params.activityId;
    // findById只返回一条数据
    Activity.findById(activityId, function(err, result) {
        if (err) {
            res.json(JsonResult.fail());
        } else {
            Tag.getTagNameById(result['tag'], function(err, tag) {
                if (err) {
                    res.json(null);
                } else {
                    tag.length > 0 && (result.tag = tag);
                    // 返回的results中的每一项都是进过封装了的模型对象，不是{}这种形式的，不过定义了toJSON这个方法只返回数据属性
                    res.json(result);
                }
            });
        }
    })
});

// 取回一个活动的所有评论
router.get('/:activityId/comments', function(req, res, next) {
    var activityId = req.params.activityId;
    Comment.getByActivityId(activityId, function(err, results) {
        if (err) {
            res.json(null);
        } else {
            res.json(results);
        }
    });
});

// 添加一条评论
router.post('/:activityId/comments', function(req, res, next) {
    var body = req.body;
    var temp = new Comment(body);
    temp.save(function(err, model) {
        if (err) {
            res.json(null);
        } else {
            model.mergeUser(function(err, n_model) {
                res.json(n_model);
            });
        }
    });
});

module.exports = router;