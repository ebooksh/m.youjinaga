// 依赖
var express = require('express');
var router = express.Router();
var path=require('path');
var fs=require('fs');
var JsonResult = require('../utils/jsonResult');
var utility = require('utility');

// 模型
var Activity = require('../models/activity');
var Tag = require('../models/tag');

// util route
router.get("/tags", function(req, res, next) {
    var queryCmd = Tag.find({}).sort({
        heat: "desc"
    });
    queryCmd.exec(function(err, results) {
        if (err) {
            res.json(JsonResult.fail());
        } else {
            res.json(JsonResult.succ(results));
        }
    })
});

router.get('/tags/add', function(req, res, next) {
    var arr = [],
        len = arr.length;
    while (len--) {
        var t = new Tag({
            tagName: arr[len]
        });
        t.save();
    }
});

router.get('/search', function(req, res, next) {
    var keyword = req.query.keyword;
    var query;
    keyword == null ? (query = {}) : (query = {
        header: new RegExp(keyword, "gi")
    });
    Activity.find(query, function(err, results) {
        if (err) {
            res.json(JsonResult.fail());
        } else {
            res.json(JsonResult.succ(results));
        }
    });
});

// 上传图片
// PS: 4.0 的 bodyparser 不处理文件了
router.post('/upload', function(req, res) {
    var extension,
        mimetype = req.query['mimetype'];
    switch (mimetype){
        case 'image/gif':
            extension = 'gif';
            break;
        case 'image/jpeg':
            extension = 'jpg';
            break;
        case 'image/png':
            extension = 'png';
            break;
    }
    var filename = utility.md5(String((new Date()).getTime())) + String(parseInt(Math.random()*1000)) + '.' + extension;
    var upload_path = path.join(__dirname, '../public/uploads/');
    var base_url    = '/uploads/';
    var filePath    = path.join(upload_path, filename);
    var fileUrl     = base_url + filename;

    if(req.header('content-type')){
        //非安卓
        req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            console.log(fieldname,filename);
            file.pipe(fs.createWriteStream(filePath));
        });
        req.busboy.on('finish', function() {
            res.json({
                success: true,
                thumbUrl:fileUrl
            });
        });
        req.pipe(req.busboy);
    }else{
        //安卓中采用拼接buffer的方式
        var imagedata = '';
        req.setEncoding('binary'); // 编码data事件中传递进去的数据
        req.on('data', function (chunk) {
            imagedata += chunk
        });
        req.on('end', function () {
            fs.writeFile(filePath, imagedata, 'binary', function(err){
                if (err) throw err
                console.log('File saved.');
                res.json({
                    success: true,
                    thumbUrl:fileUrl
                });
            })
        });
    }
});


module.exports = router;