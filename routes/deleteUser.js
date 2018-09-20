var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var cloudinary = require("cloudinary");
var User = require("../models/User");

router.get("/", (req, res) => {
  jwt.verify(req.headers.token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      res.send(err);
    } else {
      User.find({ userId: decoded.userId }, function(err, user) {
        if (err) console.log(err);
        console.log(user);
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_NAME,
          api_key: process.env.CLOUDINARY_KEY,
          api_secret: process.env.CLOUDINARY_SECRET
        });
        // go through all of the users sites
        user[0].sites.forEach((x, i) => {
          console.log(x);
          // create an array so we can delete both types of images
          let arr = ["desktopImage", "mobileImage"];
          // delete mobile and desktop images
          for (imageType of arr) {
            let public_id = x[imageType].slice(62, -4);
            cloudinary.uploader.destroy(public_id, function(result) {
              console.log(result);
            });
          }
        });
      }).then(() => {
        User.remove({ userId: decoded.userId }, function(err) {
          if (err) console.log(err);
          console.log("user removed");
          res.sendStatus(200);
        });
      });
    }
  });
});

module.exports = router;
