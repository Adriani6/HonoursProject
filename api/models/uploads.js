var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var http = require('http');
var crypto = require('crypto');
var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId; 
var $ = require('jquery')(require("jsdom").jsdom().defaultView);


var self;

function Uploads()
{
  self = this;
}

Uploads.prototype.newUserPhoto = function(req, res)
{
  var fileName = undefined; 

  if(req.session != undefined && req.session.user != undefined)
  {
        // create an incoming form object
      var form = new formidable.IncomingForm();

      // specify that we want to allow the user to upload multiple files in a single request
      form.multiples = true;

      // store all uploads in the /uploads directory
      form.uploadDir = path.join(__dirname, '../../website/uploads/profile');

      // every time a file has been uploaded successfully,
      // rename it to it's orignal name
      form.on('file', function(field, file) {
        var date = new Date();
        fileName = crypto.createHmac('sha256', date.getTime() + req.session.user).digest('hex');

        var fileFormat = file.name.split(".");
        fileName += "." + fileFormat[fileFormat.length - 1];
        fs.rename(file.path, path.join(form.uploadDir, fileName));

        
      });

      // log any errors that occur
      form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
      });

      // once all the files have been uploaded, send a response to the client
      form.on('end', function() {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
              db.collection("users").update(
                  { "_id": new ObjectId(req.session.user)}, 
                  {$set: {'profile.photo': fileName}}, function(err, out)
                  {
                      if(err)
                          res.send("There was an issue updating profile photo.");
                      else
                          res.send("Profile photo updated.");
                  }
              )
        });
      });

      // parse the incoming request containing the form data
      form.parse(req);
  }
  else
  {
    res.send("Fail");
  }
}

Uploads.prototype.reverseSearch = function(url, callback)
{
  http.get("https://images.google.com/searchbyimage?image_url="+url, function(re){
        var body = '';

        re.on('data', function(chunk){
            body += chunk;
        });

        re.on('end', function(){
            var html = $.parseHTML(body);
            $(html).find("#topstuff").each(function()
            {
              $(this).find(".card-section").each(function()
              {
                $(this).find("._hUb").each(function()
                {
                  console.log($(this).find("a").first().text());
                  callback($(this).find("a").first().text())
                })
              })
            })
        });
    }).on('error', function(e){
        console.log("Got an error: ", e);
    });
}

Uploads.prototype.uploadImage = function(req, res)
{
  var album = req.query.album;
    console.log("Hello")
    console.log(album)
    
    var fileName = undefined; 

  if(req.session != undefined && req.session.user != undefined)
  {
        // create an incoming form object
      var form = new formidable.IncomingForm();

      // specify that we want to allow the user to upload multiple files in a single request
      form.multiples = true;

      // store all uploads in the /uploads directory
      form.uploadDir = path.join(__dirname, '../../website/uploads/photos');

      // every time a file has been uploaded successfully,
      // rename it to it's orignal name
      form.on('file', function(field, file) {
        var date = new Date();
        fileName = crypto.createHmac('sha256', date.getTime() + req.session.user).digest('hex');

        var fileFormat = file.name.split(".");
        fileName += "." + fileFormat[fileFormat.length - 1];
        fs.rename(file.path, path.join(form.uploadDir, fileName));

        
      });

      // log any errors that occur
      form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
      });

      // once all the files have been uploaded, send a response to the client
      form.on('end', function() {
        mongo.connect("mongodb://localhost/tripcards", function(err, db)
        {
              db.collection("photos").update(
                  { "owner": new ObjectId(req.session.user), "_id": new ObjectId(album)}, 
                  {$push: {'photos': {file : fileName, time : new Date().getTime()}}}, function(err, out)
                  {
                      if(err)
                          res.send("There was an issue updating profile photo.");
                      else
                          res.send("Profile photo updated.");
                  }
              )
        });
      });

      // parse the incoming request containing the form data
      form.parse(req);
  }
  else
  {
    res.send("Fail");
  }
}

Uploads.prototype.revSearchReq = function(req, res)
{
  
    
    var fileName = undefined; 

  if(req.session != undefined && req.session.user != undefined)
  {
        // create an incoming form object
      var form = new formidable.IncomingForm();

      // specify that we want to allow the user to upload multiple files in a single request
      form.multiples = true;

      // store all uploads in the /uploads directory
      form.uploadDir = path.join(__dirname, '../../website/uploads/revSearch');

      // every time a file has been uploaded successfully,
      // rename it to it's orignal name
      form.on('file', function(field, file) {
        var date = new Date();
        fileName = crypto.createHmac('sha256', date.getTime() + req.session.user).digest('hex');

        var fileFormat = file.name.split(".");
        fileName += "." + fileFormat[fileFormat.length - 1];
        fs.rename(file.path, path.join(form.uploadDir, fileName));

        
      });

      form.on('end', function() {
        self.reverseSearch("_WHOLE IMAGE URL GOES HERE WITH NAME", function(response)
        {
          res.send(response);
        })
      })

      // log any errors that occur
      form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
      });

      // parse the incoming request containing the form data
      form.parse(req);
  }
  else
  {
    res.send("Fail");
  }  
}

module.exports = Uploads