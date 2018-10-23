// 活动模型

var mongoose = require("mongoose");

var activitySchema = mongoose.Schema({
    email: String,
    header: String,
    tag: {
        type: Array,
        default: []
    },
    beginTime: {
        type: Date,
        default: new Date()
    },
    endTime: {
        type: Date,
        default: new Date()
    },
    uploadTime: {
        type: Date,
        default: new Date()
    },
    link: String,
    intro: String,
    cover: String
});

// 默认变为复数形式啊，Activity－》activities，不是activitys!!!
var Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;