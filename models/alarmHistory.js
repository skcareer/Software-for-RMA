var mongoose   = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");

var AlarmSchema = new mongoose.Schema({
    siteID: String,
    alarmName: String,
    severity: String,
    createdAt: {type: Date, default: Date.now}
},
{
    capped: { size: 10, max: 50 }
});
// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Alarm", AlarmSchema);