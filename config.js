// 不能用localhost，而是process.env.IP
exports.db="mongodb://"+process.env.IP+"/YJAData";
exports.port=3000;