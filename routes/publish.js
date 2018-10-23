var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('publish.html', {
      title: 'Express'
  });
});

router.get('/:activityId', function(req, res, next) {
  res.send("未完，待续中...")
});


module.exports = router;