process.env.NODE_ENV = "test";

const keyboards = require("../models/keyboards.js");
const user = require("../models/user.js");



before((done) => {
    keyboards.deleteMany({},function(err){});
    user.deleteMany({},function(err){});
    done();

});

after((done) => {
    keyboards.deleteMany({},function(err){});
    user.deleteMany({},function(err){});
    done();

});
