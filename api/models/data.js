var mongo = require("mongodb").MongoClient;

var self;

function Data()
{
    self = this;
}

Data.prototype.searchAttraction = function(req, res)
{
    var location = req.params.location;

    if(location != undefined)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            //Finish this function
            db.collection("attractions").findOne({location: location}, function(err, data)
            {
                if(err)
                    console.log(err)

                console.log(data)
            })
        })
    }
}

Data.prototype.searchLocation = function(req, res)
{
    var location = req.params.location;

    if(location != undefined)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            //Finish this function
            db.collection("attractions").find({location: location}).toArray(function(err, data)
            {
                res.json(data)
            })
        })
    }
}

module.exports = Data;