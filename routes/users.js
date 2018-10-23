var express = require('express');
var router = express.Router();

var User=require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/add', function (req, res, next) {
    var nuser=new User({
        avatar: 'img/photos/sunny.png',
        username: '叶陈辉',
        password: '123456',
        email: '932241741@qq.com'
    });
    nuser.save();
});

module.exports = router;