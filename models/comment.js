// 评论

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var commentSchema = Schema({
    activityId: String,
    userId: {
        /*关联查询*/
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    time: {
        type: Date,
        default: new Date()
    }
});

commentSchema.methods.mergeUser=function (callback) {
    // 拿到这条记录的ref引用值
    this.populate('userId', callback);
};

commentSchema.statics.getByActivityId = function(id, callback) {
    this.find({
        activityId: id
    }).sort({
        time: 'desc'
    }).populate('userId').exec(callback);
};

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;