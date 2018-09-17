var express = require("express");
var router = express.Router();
var cloudinary = require("cloudinary");

router.post("/delete", (req, res) => {
  console.log(req.body);
  // find the user
  User.findOne({ slackId: req.body.id }, function(err, user) {
    if (err) console.log(err);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
    });

    let public_id = req.body.image.slice(62, -4);

    console.log("this is the id", public_id);

    // remove the site on cloudinary
    cloudinary.uploader.destroy(public_id, function(result) {
      console.log(result);
    });

    // remove the site from the database
    user.sites.forEach((x, i) => {
      console.log(x._id);
      if (x._id == req.body.site) {
        console.log("yahhhh removing something");
        user.sites[i].remove();
      }
    });
    // save the user with the site removed
    user.save(function(err) {
      if (err) console.log(err);
      console.log("site removed successfully");
    });
    res.send("blah");
  });
});

module.exports = router;
