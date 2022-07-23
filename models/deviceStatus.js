var mongoose   = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");

var DeviceStatusSchema = new mongoose.Schema({
    internetConnectivity  : Boolean,
    initialServerLoading  : Boolean,
    serverConnectivity    : Boolean,
    sitecommissioned      : Boolean,
    siteID                : String,
    deviceID              : String,
    customerName          : String,
    itemsInDataBuffer     : Number,
    itemsInAlarmBuffer    : Number,
    siteConfigVersion     : Number,
    cloudConfigVersion    : Number,
    statusName            : String,
    createdAt: {type: Date, default: Date.now}
});
// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("DeviceStatus", DeviceStatusSchema);