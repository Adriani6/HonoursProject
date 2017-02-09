var crypto = require('crypto');
var mongo = require("mongodb").MongoClient;

var self;

function User()
{
    self = this;
}

User.prototype.new = function(req, res)
{

    if (req.method == 'POST') {
        var jsonString = '';

        req.on('data', function (data) {
            jsonString += data;
        });

        req.on('end', function () {
            var data = JSON.parse(jsonString);

            self.verifyRegistrationData(data, function(err)
            {
                if(err)
                    res.status(409).send("There was an issue completing the registration!");
                else
                {
                    delete data.confirmpassword;
                    data.password = self.createHash(data.password);

                    mongo.connect("mongodb://localhost/tripcards", function(err, db)
                    {
                        db.collection('users').insert(data, function(err, result)
                        {
                            if(!err)
                                res.status(200).send("Registration completed successfully!");
                        });
                    })

                    console.log(data);
                    
                }
            });
            //console.log(JSON.parse(jsonString));
        });
    }
}

User.prototype.login = function(req, res)
{
    console.log(req)
}

User.prototype.getProfilePhoto = function(req, res)
{

}

User.prototype.createHash = function(pass)
{
    var hash = crypto.createHmac('sha512', "NqlTyvMyA5oKg8Z4");
            hash.update(pass);
    var value = hash.digest('hex');

    return value;
}

User.prototype.verifyRegistrationData = function(data, callback)
{
    var reg = /<[a-z\][\s\S]*>/i;

    if(data.firstname.length < 2)
    {
        callback(1);
        return;
    }    
    if(data.surname.length < 2)
    {
        callback(1);
        return;
    }
    if(data.password < 6)
    {
        callback(1);
        return;
    }
    if(data.confirmpassword !== data.password)
    {
        callback(1);
        return;
    }

    var atpos = data.email.indexOf("@");
    var dotpos = data.email.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=data.email.length) {
        callback(1);
        return;
    }    

    callback(0);
    return; 
}

module.exports = User;