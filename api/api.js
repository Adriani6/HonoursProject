var User = require("./models/user.js");

function API()
{
    this.user = new User();
}

API.prototype.request = function(req, res)
{
    //Request Verifier
}

module.exports = API