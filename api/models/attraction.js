var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId; 

function Attraction(){}

Attraction.prototype.getOwned = function(req, res)
{
    var done = 0;
    var toSend = [];

    function fetchAttractionDetails(id, claimedData)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            //Finish this function
            db.collection("attractions").findOne({"_id": new ObjectId(id)}, function(err, data)
            {
                if(err)
                    console.log(err)

                data.offers = claimedData.offers;

                toSend.push(data);

                done--;       

                if(done == 0)
                {
                    res.send(toSend);
                }
            })
        })
    }

    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        //Finish this function
        db.collection("claimed_attractions").find({"user": new ObjectId(req.session.user)}).toArray(function(err, data)
        {
            if(err)
                console.log(err)
            
            done = data.length;

            for(var i = 0; i < data.length; i++)
            {
                fetchAttractionDetails(data[i].attr, data[i]);
            }

            //res.send(data)
        })
    })
}

Attraction.prototype.createOffer = function(req, res)
{
    var data = req.body;

    if(data.name != undefined && data.description != undefined && data.start != undefined && data.end != undefined && data.attraction != undefined)
    {
        var attraction = req.body.attraction;

        delete req.body.attraction;

        req.body.stamp = new Date().getTime();

        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            db.collection("claimed_attractions").update(
                { user: new ObjectId(req.body.attraction), user: new ObjectId(req.session.user) }, 
                {$push: {'offers': req.body}}
            )
        })

        res.send("Success");
    }
    else
    {
        res.send("Error");
    }

    
}

Attraction.prototype.removeOffer = function(req, res)
{
    console.log(req.body);
    mongo.connect("mongodb://localhost/tripcards", function(err, db)
    {
        db.collection("claimed_attractions").update({"user": new ObjectId(req.session.user), attr: new ObjectId(req.body.attr)}, { $pull: { 'offers': { stamp: req.body.stamp } } });
    })

    res.send("Success");
}

module.exports = Attraction;