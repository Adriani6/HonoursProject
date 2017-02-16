var crypto = require('crypto');
var mongo = require("mongodb").MongoClient;
var session = require('express-session');
var ObjectId = require('mongodb').ObjectId; 

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
                            {
                                res.status(200).send("Registration completed successfully!");
                                req.session.user = result._id;
                            }
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
    if (req.method == 'POST') {
        var jsonString = '';

        req.on('data', function (data) {
            jsonString += data;
        });

        req.on('end', function () {
            console.log(jsonString)
            jsonString = JSON.parse(jsonString)
            var email = jsonString.email || '';
            var passw = jsonString.password || '';

            mongo.connect("mongodb://localhost/tripcards", function(err, db)
            {
                db.collection('users').findOne({email: email}, function(err, result)
                {
                    if(!err)
                    {
                        if(result != null)
                        {
                            var pw1 = self.createHash(passw), pw2 = result.password;

                            if(pw1 == pw2)
                            {
                                console.log(result)
                                req.session.user = result["_id"];

                                res.send("Successfully Logged In.");     
                            }
                            else
                            {
                                res.status(409).send("Incorrect Credentials.");
                            }
                        }
                        else
                        {
                            res.status(409).send("Incorrect Email.");
                        }
                    }
                });
            })
        })
    }

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

User.prototype.getSession = function(req, res)
{
    res.send(req.session.user);
}

User.prototype.getUserData = function(req, res)
{
    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        //Finish this function
        db.collection("users").findOne({"_id": req.session.user}, function(err, data)
        {
            if(err)
                console.log(err)

            delete data.password;

            res.send(data)
        })
    })
}

module.exports = User;