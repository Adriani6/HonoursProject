var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId; 
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var crypto = require('crypto');

function Org()
{

}

Org.prototype.create = function(req, res)
{
    if(req.body.name != undefined)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            db.collection("ogranizations").insert({"creator": new ObjectId(req.session.user), "name" : req.body.name}, function(err, data)
            {
                if(err)
                    console.log(err)
                
                res.send(data);
            })
        })
    }
}

Org.prototype.getOwned = function(req, res)
{
    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        db.collection("ogranizations").find({"creator": new ObjectId(req.session.user)}).toArray(function(err, data)
        {
            if(err)
                console.log(err)
            
            res.send(data);
        })
    })
}

Org.prototype.uploadProfilePic = function(req, res)
{
    console.log(req.query.attraction);
    if(req.session != undefined && req.session.user != undefined && req.query.attraction != undefined)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            db.collection("claimed_attractions").findOne({attr: new ObjectId(req.query.attraction), user : new ObjectId(req.session.user)}, function(err, data)
            {
                if(err)
                    res.send("Error");

                if(data != null)
                {
                    var fileName = undefined; 
                    var form = new formidable.IncomingForm();
                    form.multiples = false;
                    form.uploadDir = path.join(__dirname, '../../website/uploads/places/profile');

                    form.on('file', function(field, file) {
                        var date = new Date();
                        fileName = crypto.createHmac('sha256', date.getTime() + req.session.user).digest('hex');

                        var fileFormat = file.name.split(".");
                        fileName += "." + fileFormat[fileFormat.length - 1];
                        fs.rename(file.path, path.join(form.uploadDir, fileName));                        
                    });
                    
                    form.on('error', function(err) {
                        console.log('An error has occured: \n' + err);
                    });

                    form.on('end', function() {
                        db.collection("attractions").update({ "_id": new ObjectId(req.query.attraction)}, {$set: {'profile.photo': fileName}}, function(err, out)
                        {
                            if(err)
                                res.send("There was an issue updating profile photo.");
                            else
                                res.send("Profile photo updated.");
                        })
                    });

                    form.parse(req);
                }
                else
                {
                    res.send("Fail");
                }  
            })
        })
    }
  
}

module.exports = Org;