// 标签模型

var mongoose = require("mongoose");
var _ = require('underscore');

var tagSchema = mongoose.Schema({
    tagName: String,
    heat: {
        type: Number,
        default: 0
    }
});

tagSchema.statics.getTagNameById = function(id, callback) {
    var query;
    if (_.isArray(id)) {
        if(id.length==0) {
            callback(null, []);
            return;
        }
        query=this.where('_id').in(id);
        // query=this.where('_id').in(id).select('tagName -_id'); // select：只返回这一项但是吧结果封装成对象了而不是纯数据。减号表示强制排除_id
    } else {
        query=this.find({_id: id});
        // query=this.find({_id: id}).select('tagName -id');
    }
    query.exec(function (err, results) {
        if (err) {
            callback(err);
        } else {
            // var arr=_.map(results, function (item) {
            //     return item.tagName; // 前面的select就没有意义了
            // });
            callback(null, results);
        }
    });
};

var Tag = mongoose.model("Tag", tagSchema);


module.exports = Tag;