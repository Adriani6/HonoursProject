var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId; 

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

module.exports = Org;