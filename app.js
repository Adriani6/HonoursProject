var express = require('express');
var router = express.Router();
var app = express();
var appApi = require("./api/api.js");

var api = new appApi();

app.use('/', express.static(__dirname + '/website'));
app.use('/portal', express.static(__dirname + '/website/assets'));
app.use('/portal', express.static(__dirname + '/website/angular'));

app.use("/api", router);

var server = app.listen(80);

app.get("/portal", function(req, res)
{
    res.sendFile(__dirname + '/website/p/index.html');
    console.log("Verify Here");
})

router.get("/", function(req, res)
{
    res.send("API Home Page")
})

router.get("/search/:location", api.data.searchLocation);

//API END POINTS

//User Requests
router.post("/user/new", api.user.new)