// mongodbUtil.js

var db_url=require("../config").db,
    mongoose=require("mongoose");

mongoose.connection.on("error", function () {
    console.log("mongodb connection error");
});
mongoose.connection.on("open", function () {
    console.log("mongodb connection open");
});

exports.connect=function () {
    mongoose.connect(db_url);
};
