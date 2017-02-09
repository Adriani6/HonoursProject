function User()
{

}

User.prototype.new = function(req, res)
{
    console.log(req);
}

User.prototype.login = function(req, res)
{
    console.log(req)
}

User.prototype.getProfilePhoto = function(req, res)
{

}

module.exports = User;