var User = require("./models/user.js");
var Data = require("./models/data.js");
var Attraction = require("./models/attraction.js");
var Org = require("./models/organization.js");
var Upload = require("./models/uploads.js");
var Route = require("./models/routes.js");

function API()
{
    this.user = new User();
    this.data = new Data();
    this.attraction = new Attraction();
    this.org = new Org();
    this.upload = new Upload();
    this.route = new Route();
}

API.prototype.request = function(req, res)
{
    //Request Verifier
}

module.exports = API