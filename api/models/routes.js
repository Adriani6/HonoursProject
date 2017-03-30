var request = require("request");
var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId; 

var self;

function Routes()
{
    self = this;
}

Routes.prototype.connectAPI = function(place1, place2, callback)
{
    request("http://yournavigation.org/api/dev/route.php?flat="+place1.coords[1]+"&flon="+place1.coords[0]+"&tlat="+place2.coords[1]+"&tlon="+place2.coords[0]+"&v=motorcar&fast=1&layer=mapnik&instructions=1&format=geojson", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var send = {};

            var j = JSON.parse(body);

            send.distance = j.properties.distance;
            send.travelTime = j.properties.traveltime;
            callback(parseFloat(j.properties.distance));
        }
        else
        {
            console.log("error");
        }
    })   
}

Routes.prototype.getUserRoutes = function(req, res)
{
    console.log("user" + req.query.user)
    if(req.query.user != undefined)
    {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
            db.collection("routes").find({"creator": new ObjectId(req.query.user)}).toArray(function(err, data)
            {
                if(err)
                    console.log(err)
                
                //console.log(data);
                res.send(data);
            })
        })
    }
}

Routes.prototype.newRoute = function(req, res)
{

}

Routes.prototype.retrieveRoute = function(req, res)
{
    
}

Routes.prototype.getDistance = function(req, res)
{

    var q = req.query;
    //http://yournavigation.org/api/dev/route.php?flat=57.11873935&flon=-2.1376237461496&tlat=55.5918735&tlon=-4.4906005&v=motorcar&fast=1&layer=mapnik&instructions=1
    request("http://yournavigation.org/api/dev/route.php?flat="+q.flat+"&flon="+q.flng+"&tlat="+q.tlat+"&tlon="+q.tlng+"&v=motorcar&fast=1&layer=mapnik&instructions=1&format=geojson", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var send = {};
            
            var j = JSON.parse(body);

            send.distance = j.properties.distance;
            send.travelTime = j.properties.traveltime;
            res.send(send)
        }
        else
        {
            console.log("error");
        }
    })

}

Routes.prototype.sortRoute = function(req, res)
{
    self.prepareSortingRoutine(req.body, undefined, undefined, function(data)
    {
        res.send(data);
    });
}

Routes.prototype.findInArray = function(array, item, callback)
{
    for(var i = 0; i < array.length; i++)
    {
        if(array[i].id == item.id)
        {
            callback(i);
        }
    }
}

Routes.prototype.prepareSortingRoutine = function(data, outData, newStartingPoint, callback)
{
    var out = []
    if(outData != undefined)
        out = outData;

    var _places = data.slice();
    var places = data.slice();
    var startingPoint = places[0];

    if(newStartingPoint != undefined)
    {
        startingPoint = newStartingPoint;
        self.findInArray(places, newStartingPoint, function(index)
        {
            places.splice(index, 1);
        })
    }
    else
    {
        out.push(startingPoint)
        places.splice(0, 1);
    }

    if(places.length > 0)
    {
        for(var i = 0; i < places.length; i++)
        {
            if(places.length == i)
            {
                
            }
            else
                checkDistance(startingPoint, places[i]);
        }
    }
    else
    {
        callback(out);
    }
    
    var processed = 0;
    var best = undefined;
    var bestPlace = undefined;

    function checkDistance(place, place2)
    {
        
        self.connectAPI(place, place2, function(distance)
        {
            
            processed++;
            //console.log("Processed: ", processed, places.length)
            //console.log(processed, place, place2)
            if(best == undefined)
            {
                //console.log(distance, place, place2)
                best = distance;
                bestPlace = place2;
                if(processed == places.length)
                {
                    self.findInArray(places, place2, function(index)
                    {
                        //places.splice(index, 1);
                    })
                }
                //startingPoint = place2;
            }
            else
            {
                //console.log(distance, place, place2)
                if(best > distance)
                {
                    best = distance;
                    bestPlace = place2;
                    console.log(place2.id + " is closer to " + place.id + "("+distance+")");
                    self.findInArray(places, place2, function(index)
                    {
                        //console.log(place2.id + " is " + index);
                        
                    })
                }
            }

            if(processed == places.length)
            {
                bestPlace.distance = best;
                out.push(bestPlace);

                self.prepareSortingRoutine(places, out, bestPlace, callback);

               // console.log(bestPlace);
            }

            if(places.length == 0)
            {
                console.log(out)
                console.log("Can send now");
            }
        })
    }
}

module.exports = Routes;