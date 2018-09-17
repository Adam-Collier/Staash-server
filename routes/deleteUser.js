var express = require("express");
var router = express.Router();
var cloudinary = require("cloudinary");

router.post("/", (req, res) => {
  console.log(req.body);
  User.findOne({ slackId: req.body.id })
    .exec()
    .then(user => {
      // go through all of the users sites
      user.sites.forEach((x, i) => {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_NAME,
          api_key: process.env.CLOUDINARY_KEY,
          api_secret: process.env.CLOUDINARY_SECRET
        });

        // create an array so we can delete both types of images
        let arr = [desktopImage, mobileImage];

        // delete mobile and desktop images
        for (imageType in arr) {
          let public_id = x.imageType.slice(62, -4);
          cloudinary.uploader.destroy(public_id, function(result) {
            console.log(result);
          });
        }
      });
    })
    .then(() => {
      User.remove({ slackId: req.body.id }, function(err) {
        res.send("logout");
      });
    });
});

module.exports = router;
