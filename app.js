var express = require('express');
var router = express.Router();
var app = express();
var appApi = require("./api/api.js");

var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore(
      {
        uri: 'mongodb://localhost:27017/sessions',
        collection: 'sessions'
      });

    // Catch errors
    store.on('error', function(error) {
      assert.ifError(error);
      assert.ok(false);
    });

    var storeData = {
      secret: 'This is a secret',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      },
      store: store,
      // Boilerplate options, see:
      // * https://www.npmjs.com/package/express-session#resave
      // * https://www.npmjs.com/package/express-session#saveuninitialized
      resave: true,
      saveUninitialized: true
    }
    
    app.use(require('express-session')(storeData));
    router.use(require('express-session')(storeData))

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
    //console.log(req.session)
})

router.get("/search/:location", api.data.searchLocation);

//API END POINTS

//User Requests
router.post("/user/new", api.user.new)
router.post("/user/signin", api.user.login)
router.get("/user/session", api.user.getUserData)