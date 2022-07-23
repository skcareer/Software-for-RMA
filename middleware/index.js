//All middleware go here!
var User          = require("../models/user");
var middlewareObj = {};


middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.isLoggedInAdmin = function (req, res, next) {
    if(req.isAuthenticated() && req.user.isAdmin){
        return next();
    }
    req.flash("error", "Permission denied, you are not admin");
    res.redirect("/");
};

module.exports = middlewareObj;