var User = require("./models/user.js");
var Data = require("./models/data.js");
var Attraction = require("./models/attraction.js");

function API()
{
    this.user = new User();
    this.data = new Data();
    this.attraction = new Attraction();
}

API.prototype.request = function(req, res)
{
    //Request Verifier
}

module.exports = API