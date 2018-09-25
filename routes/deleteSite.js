var express = require("express");
var router = express.Router();
var cloudinary = require("cloudinary");
var User = require("../models/User");
var jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
  console.log(req.body);
  // find the user
  jwt.verify(req.headers.token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      res.send(err);
    } else {
      User.findOne({ userId: decoded.userId }, function(err, user) {
        if (err) console.log(err);

        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_NAME,
          api_key: process.env.CLOUDINARY_KEY,
          api_secret: process.env.CLOUDINARY_SECRET
        });

        let site = {};

        user.sites.forEach((x, i) => {
          x.id == req.body.id ? ((site = x), user.sites[i].remove()) : null;
        });

        ["desktopImage", "mobileImage"].forEach(x => {
          let public_id = site[x].slice(62, -4);
          cloudinary.uploader.destroy(public_id, function(result) {
            console.log(result);
          });
        });

        // save the user with the site removed
        user.save(function(err) {
          if (err) console.log(err);
          console.log("saved");
          res.send("blah");
        });
      });
    }
  });
});

module.exports = router;
