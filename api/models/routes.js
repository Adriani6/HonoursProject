var request = require("request");

function Routes(){}

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

module.exports = Routes;