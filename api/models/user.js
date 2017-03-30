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
        console.log("Getting user data")
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

User.prototype.fetchFollowers = function(req, res)
{
    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        db.collection("users").find({"following": req.query.user}).toArray(function(err, followers)
        {
            //Get names and push them as JSON objects into array to reduce later operations.
            res.send(followers);
        });
    });
}

User.prototype.getProfile = function(req, res)
{
    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        
        var followers = [];
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
    var alerts = [];
    var togo = 0;

    var lastCheck = 0;
    
    //alerts
    var att_following = 0;
    var offers_checked = 0;

    function checkActivityTable(callback)
    {
        //Check alerts for likes etc.
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            db.collection("activity").find({"receiver": new ObjectId(req.session.user), "stamp" : {$gt : lastCheck}}).toArray(function(err, data)
            {
                var toGet = data.length;

                for(var i = 0; i < data.length; i++)
                {
                    (function () {
                        var d = data[i];
                        self.local.getName(data[i].creator, function(name)
                        {

                            var userData = {
                                id : name._id, 
                                activityID: d.activity,
                                title : name.firstname + " " + name.surname + " likes your " + d.liked, 
                                type : "LIKE"
                            };

                            if(d.liked == "status")
                            {
                                db.collection("users").findOne({"activity.id": new ObjectId(d.activity)}, {"activity.$": 1}, function(err, data)
                                {
                                    userData.details = data.activity[0];
                                    toGet--;

                                    alerts.push(userData);

                                    if(toGet == 0)
                                        callback(alerts)
                                })
                            }
                            else if(d.liked == "basket")
                            {
                                //Operations to find basket
                                db.collection("buckets").findOne({"_id": new ObjectId(d.activity)}, {"name": 1}, function(err, data)
                                {
                                    userData.details = data;
                                    toGet--;

                                    alerts.push(userData);

                                    if(toGet == 0)
                                        callback(alerts)
                                })
                            }
                                                        
                        });
                    })();
                }  
            })
        })
    }

    function checkUpdates(id, lastCheck)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            db.collection("claimed_attractions").findOne({"attr": new ObjectId(id)}, function(err, data)
            {
                if(err)
                    console.log(err)

                offers_checked += data.offers.length;
                
                for(var i = 0; i < data.offers.length; i++)
                {
                    if(lastCheck < data.offers[i].stamp)
                    {
                        //console.log(data)
                        alerts.push({title: "New Offer: " + data.offers[i].name, data: data.offers[i], type: "OFFER"});
                        offers_checked--;
                    }

                    if(att_following == 0 && offers_checked == 0)
                    {
                        res.send(alerts)
                    }
                    
                }
                
            })
        })
    }

    function fetchActivity(id)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            db.collection("users").findOne({"_id": new ObjectId(id)}, {"activity" : 1, "firstname": 1, "surname" : 1, "profile.photo": 1}, function(err, data)
            {
                if(err)
                    console.log(err)

                db.collection("activity").findOne({"creator": new ObjectId(req.session.user), "receiver" : new ObjectId(id), "activity": new ObjectId(data.activity[0].ID)}, function(err, aData)
                {

                    //aData ?
                    data.activity[0].aData = aData;
                    output.push(data)
                    togo--;

                    if(togo == 0)
                    {
                        res.send(output)
                    }
                })

                
            })
        })
    }

    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        
        //Finish this function
        db.collection("users").findOne({"_id": new ObjectId(req.session.user)}, {"checked": 1, "following" : 1, "following_attractions" : 1}, function(err, data)
        {
            if(err)
                console.log(err)
            else
            {
                lastCheck = data.checked;
                console.log(lastCheck)
                //console.log(data.following)
                togo = data.following.length;

                if(req.query.type == "feed")
                {
                    for(var i = 0; i < data.following.length; i++)
                    {
                        //console.log(data.following[i])
                        fetchActivity(data.following[i]);
                    }
                }
                else if(req.query.type == "alerts")
                {
                    checkActivityTable(function(likeAlerts)
                    {
                        //alerts = likeAlerts;

                        att_following = data.following_attractions.length;

                        for(var y = 0; y < data.following_attractions.length; y++)
                        {
                            checkUpdates(data.following_attractions[y], data.checked);
                            att_following--;
                        }
                    });
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
    var output = 0;
    var toSend = undefined;
    var toGo = 0;

    function getAttractionData(i, y)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            db.collection("attractions").findOne({"_id": new ObjectId(toSend[i].attractions[y].id)}, {"name" : 1, "location" : 1}, function(err, data)
            {
                toSend[i].attractions[y].data = data;

                toGo--;

                if(toGo == 0)
                {
                    res.send(toSend);
                }
            })
        })
    }

    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        db.collection("buckets").find({"creator": new ObjectId(req.session.user)}).toArray(function(err, data)
        {
            toSend = data;

            for(var i = 0; i < data.length; i++)
            {
                if(data[i].attractions != undefined)
                {
                    toGo += data[i].attractions.length;

                    for(var y = 0; y < data[i].attractions.length; y++)
                    {
                        getAttractionData(i, y);
                    }
                }
                else if(toGo == 0 && i == data.length - 1)
                {
                    res.send(toSend);
                }
            }

            //res.send(data);
        })
    })
}

User.prototype.isFollowing = function(req, res)
{
    if(req.session.user == req.query.user)
    {
        res.send("self");
    }
    else
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            db.collection("users").findOne({"_id" : new ObjectId(req.session.user), "following" : req.query.user}, function(err, data)
            {
                if(err)
                    res.send("error");

                if(data != null)
                {
                    res.send(true);
                }
                else
                {
                    res.send(false);
                }
            })
        })
    }
}

User.prototype.createActivity = function(req, res)
{
    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        db.collection("activity").findOne({"creator" : new ObjectId(req.session.user), "receiver" : new ObjectId(req.body.receiver), "activity": new ObjectId(req.body.activity)}, function(err, data)
        {
            if(err)
                res.send("Error");
            else
            {
                if(data !== null)
                {
                    console.log("Removing")
                    db.collection("activity").remove({"creator" : new ObjectId(req.session.user), "receiver" : new ObjectId(req.body.receiver), "activity": new ObjectId(req.body.activity)}, function(err, d)
                    {
                        if(err)
                            res.send("Error");
                        else
                            res.send("Deleted");
                    });
                }
                else
                {
                    // Status, Bucket,
                    console.log("Inserting")
                    req.body.creator = new ObjectId(req.session.user);
                    req.body.activity = new ObjectId(req.body.activity);
                    req.body.receiver = new ObjectId(req.body.receiver);
                    req.body.stamp = new Date().getTime();

                    db.collection("activity").insert(req.body, function(err, data)
                    {
                        if(err)
                            res.send("Error")
                        else
                        {
                            res.send("Inserted");
                        }
                    })
                }
            }
        })
    });
}

User.prototype.deleteBucket = function(req, res)
{

}

User.prototype.addToBucket = function(req, res)
{
    console.log(req.body)
    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        db.collection("buckets").findOne({creator: new ObjectId(req.session.user), "_id": new ObjectId(req.body.bucket), 'attractions.id': new ObjectId(req.body.attraction)}, function(err, data)
        {
            if(data == null)
            {
                db.collection("buckets").update(
                    { creator: new ObjectId(req.session.user), "_id": new ObjectId(req.body.bucket) }, 
                    {$push: {'attractions': {"id" : new ObjectId(req.body.attraction)}}}, function(err, results)
                    {
                        if(err)
                            res.send("There was an issue adding to bucket");
                        else
                            res.send("Attraction added to bucket");
                    }
                )
            }
            else
                res.send("Attraction already in bucket.");
        })
    });
}

User.prototype.removeFromBucket = function(req, res)
{
    
}

User.prototype.checkActivity = function(req, res)
{

}

User.prototype.getComplateAlbums = function(req, res)
{
    console.log(req.query);

    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        db.collection("photos").find({owner: new ObjectId(req.query.user)}).toArray(function(err, data)
        {
            res.send(data);
        });
    });
}

User.prototype.createAlbum = function(req, res)
{
    var album = req.body.album;

    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        db.collection("photos").insert({"owner": new ObjectId(req.session.user), "album" : album}, function(err, data)
        {
            res.send(data);
        });
    });
}

User.prototype.updateProfileData = function(req, res)
{
    var sentData = req.body;
    var preparedStatement = {};

    var allowedAttributes = {
        "bio" : "profile.bio",
        "gender" : "profile.gender",
        "location" : "profile.location",
        "firstname" : "firstname",
        "surname" : "surname",
        "year" : "profile.dob.year",
        "month" : "profile.dob.month",
        "day" : "profile.dob.day",
        "tags" : "profile.tags"
    }
    
    for(var key in Object.keys(sentData))
    {
        console.log(Object.keys(sentData)[key]);
        if(allowedAttributes[Object.keys(sentData)[key]])
        {
            preparedStatement[allowedAttributes[Object.keys(sentData)[key]]] = sentData[Object.keys(sentData)[key]];
            console.log(preparedStatement)
        }
        else
        {
            console.log("Byet")
        }
    }

    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        db.collection("users").updateOne({"_id": new ObjectId(req.session.user)}, {$set: preparedStatement}, function(err, data)
        {
            res.send(data);
        });
    });
}

User.prototype.local = {

    getName : function(uID, callback)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            db.collection("users").findOne({"_id": new ObjectId(uID)}, {firstname : 1, surname: 1}, function(err, data)
            {
                callback(data);
            });
        });
    }
}

User.prototype.newJourney = function(req, res)
{
    if(req.session != undefined && req.session.user != undefined)
    {
        req.body.creator = req.session.user;
        
        if(req.body != undefined && req.body.name != undefined && req.body.places.length > 1)
        {
            mongo.connect("mongodb://localhost/tripcards", function(err, db)
            {
                db.collection("routes").insert(req.body, function(err, data)
                {
                    var routeID = data["ops"][0]["_id"];
                    db.collection("users").update({"_id" : new ObjectId(req.session.user)},{$push : {routes: routeID}}, function(err, data)
                    {
                        if(err)
                            console.log(err)
                        else
                            res.send("Route Created");
                    })
                });
            });
        }
    }
}

module.exports = User;