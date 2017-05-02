var express = require('express');
var router = express.Router();
var app = express();
var appApi = require("./api/api.js");
var assert = require('assert')

var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var bodyParser = require('body-parser');

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
    router.use(bodyParser.json()); // support json encoded bodies
    router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var api = new appApi();

app.use('/', express.static(__dirname + '/website'));
app.use('/portal', express.static(__dirname + '/website/assets'));
app.use('/portal', express.static(__dirname + '/website/angular'));

app.use("/api", router);

var server = app.listen(80);

app.get("/portal", function(req, res)
{
   
  if(req.session.user != undefined)
  {
    res.sendFile(__dirname + '/website/p/index.html');
    console.log(req.session.user);
  }
  else
  {
    res.redirect("/");
    console.log("Not logged in");
  }
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
//router.post("/user/updateBio", api.user.updateDescription)
router.get("/user/getProfile", api.user.getProfile)
router.get("/user/getFollowersRecentActivity", api.user.getFollowersRecentActivity)
router.get("/panel/getOwnedAttractions", api.attraction.getOwned)
router.get("/geocode", api.data.geoCode)
router.get("/user/getFollowers", api.user.fetchFollowers);
router.get("/user/isFollowing", api.user.isFollowing);
router.post("/user/updateProfile", api.user.updateProfileData);
router.post("/user/follow", api.user.follow);
router.post("/user/unfollow", api.user.unfollow);
router.post("/user/status/create", api.user.newStatus);

router.get("/reviews", api.data.gatherReviews);

router.post("/attraction/offer/create", api.attraction.createOffer);
router.post("/attraction/offer/remove", api.attraction.removeOffer);
router.post("/attraction/offer/get", api.attraction.fetchOffer);
router.get("/attraction/getName", api.attraction.getName);

router.post("/activity/createAction", api.user.createActivity);

//Reports
router.post("/report/new", api.data.createReport);
router.get("/admin/reports/get", api.data.getReports)
router.post("/admin/reports/resolve", api.data.resolveReport)

// Buckets
router.get("/user/retrieveBuckets", api.user.retrieveBuckets)
router.post("/user/newBucket", api.user.newBucket)
router.post("/user/addToBucket", api.user.addToBucket);

//Session
router.get("/user/session", api.user.getUserData)

//Places (Oragnizations temporary)
router.post("/org/new", api.org.create);
router.get("/org/getMine", api.org.getOwned);
router.post("/org/photo/profile", api.org.uploadProfilePic)

//Uploads
router.post("/user/newProfilePic", api.upload.newUserPhoto);
router.post("/user/photos/upload", api.upload.uploadImage)

//Photos
router.get("/user/photos/album/getAll", api.user.getComplateAlbums)
router.post("/user/photos/album/create", api.user.createAlbum);

//Journeys
router.post("/user/journey/new", api.user.newJourney);

//Routes
router.get("/route/distance", api.route.getDistance);
router.post("/route/sortRoute", api.route.sortRoute);
router.get("/user/routes/get", api.route.getUserRoutes);
router.get("/route/retrieve", api.route.retrieveRoute);

//Reverse Image Search
router.post("/places/revSearch", api.upload.revSearchReq);

router.post("/user/search", api.user.searchUser)