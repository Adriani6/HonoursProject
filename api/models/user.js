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

                    //console.log(data);
                    
                }
            });
            //console.log(JSON.parse(jsonString));
        });
    }
}

User.prototype.login = function(req, res)
{
    //res.send("hello")

            var email = req.body.email || '';
            var passw = req.body.password || '';

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
                                //console.log(result)
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
                    else
                    {
                        res.send(err)
                    }
                });
            })

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

User.prototype.getRecentActivity = function(req, res)
{
    console.log(req.query.user)

}

User.prototype.getProfile = function(req, res)
{
    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        //Finish this function
        db.collection("users").findOne({"_id": new ObjectId(req.query.user)}, function(err, data)
        {
            if(err)
                console.log(err)

            delete data.password;

            res.send(data)
        })
    })
}

User.prototype.getFollowersRecentActivity = function(req, res)
{
    //Function to be extended by taking time range checked and gets last 3-6 items per person that populates the feed.
    var output = [];
    var togo = 0;

    function fetchActivity(id)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            db.collection("users").findOne({"_id": new ObjectId(id)}, {"activity" : 1, "firstname": 1, "surname" : 1, "profile.photo": 1}, function(err, data)
            {
                if(err)
                    console.log(err)

                output.push(data)
                togo--;

                if(togo == 0)
                {
                    res.send(output)
                }
            })
        })
    }

    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        
        //Finish this function
        db.collection("users").findOne({"_id": new ObjectId(req.session.user)}, {"following" : 1}, function(err, data)
        {
            if(err)
                console.log(err)
            else
            {
                //console.log(data.following)
                togo = data.following.length;

                for(var i = 0; i < data.following.length; i++)
                {
                    //console.log(data.following[i])
                    fetchActivity(data.following[i]);
                }

            }
        })
    })    
}

User.prototype.updateDescription = function(req, res)
{
    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        
        //Finish this function
        db.collection("users").update({"_id": new ObjectId(req.session.user)}, {$set : {"profile.bio" : req.body.bio}}, function(err, data)
        {
            if(err)
                console.log(err)
            else
            {
                res.send("Set");

            }
        })
    })
}

User.prototype.updateProfilePicture = function(req, res)
{

}

User.prototype.newStatus = function(req, res)
{

}

User.prototype.deleteStatus = function(req, res)
{

}

User.prototype.deleteProfilePicture = function(req, res)
{

}

User.prototype.newBucket = function(req, res)
{
    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        db.collection("buckets").insert({"creator": new ObjectId(req.session.user), "name": req.body.name}, function(err, data)
        {
            if(err)
                console.log(err)
            else
            {

            }
        })
    });

}

User.prototype.retrieveBuckets = function(req, res)
{
    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        db.collection("buckets").find({"creator": new ObjectId(req.session.user)}).toArray(function(err, data)
        {
            console.log(data);
            res.send(data);
        })
    })
}

User.prototype.deleteBucket = function(req, res)
{

}

User.prototype.addToBucket = function(req, res)
{

}

User.prototype.removeFromBucket = function(req, res)
{
    
}

module.exports = User;