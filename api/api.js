var User = require("./models/user.js");
var Data = require("./models/data.js");

function API()
{
    this.user = new User();
    this.data = new Data();
}

API.prototype.request = function(req, res)
{
    //Request Verifier
}

module.exports = API