var mongoose   = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");

var ConfigurationSchema = new mongoose.Schema({
    customerName   :String,
    siteName       :String,
    siteID         :String,
    deviceID       :String,
    region         :String,
    address        :String,
    latitude       :Number,
    longitude      :Number,
    tenant1        :String,
    tenant2        :String,
    tenant3        :String,
    tenant4        :String,
    tenant5        :String,
    gensetCapacity :Number,
    dumName        :String,
    createdAt: {type: Date, default: Date.now}
});
// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Configuration", ConfigurationSchema);