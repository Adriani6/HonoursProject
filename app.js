var express = require('express');
var router = express.Router();
var app = express();
var appApi = require("./api/api.js");

var api = new appApi();

app.use('/', express.static(__dirname + '/website'));
app.use("/api", router);

var server = app.listen(80);

app.get("/", function(req, res)
{
    res.sendFile("index.html")
})

router.get("/", function(req, res)
{
    res.send("API Home Page")
})

//User Requests
router.get("/user/new", api.user.new)