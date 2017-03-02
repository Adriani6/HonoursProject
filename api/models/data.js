var mongo = require("mongodb").MongoClient;
var http = require('http');
var ObjectId = require('mongodb').ObjectId; 

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

Data.prototype.geoCode = function(req, res)
{
    console.log(req.query)
    http.get("http://services.gisgraphy.com//geocoding/geocode?address="+req.query.address+"&country=GB&format=json", function(re){
        var body = '';

        re.on('data', function(chunk){
            body += chunk;
        });

        re.on('end', function(){
            res.json(body);
        });
    }).on('error', function(e){
        console.log("Got an error: ", e);
    });
}

Data.prototype.gatherReviews = function(req, res)
{
    console.log(req.query)
    var attractionID = req.query.attraction;

    if(attractionID != undefined)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            //Finish this function
            db.collection("reviews").find({"attraction": new ObjectId(attractionID)}).toArray(function(err, data)
            {
                if(err)
                    console.log(err)
                else
                {
                    res.send(data);
                }
            })
        })
    }    
}

module.exports = Data;