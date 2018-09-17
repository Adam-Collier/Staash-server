var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
var jwt = require("jsonwebtoken");
var User = require("../models/User");

router.get("/", (req, res) => {
  let code = req.query.code;
  // make a get request using the code received from slack
  fetch(
    `https://slack.com/api/oauth.access?client_id=${
      process.env.CLIENT_ID
    }&client_secret=${process.env.CLIENT_SECRET}&code=${code}`
  )
    .then(response => {
      return response.json();
    })
    .then(data => {
      // sign the jwt token with identifiable data
      // this is so we can identify the user on each request
      var token = jwt.sign(
        {
          name: data.user.name,
          teamId: data.team.id,
          userId: data.user.id
        },
        // pass in the secret
        // if this changes all requests are invalid
        // and the user will need to sign in again
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      // User comes from our model
      // try to find an existing user via their email address
      User.findOne({ userId: data.user.id }, function(err, user) {
        if (err) console.log(err);

        // create a new user if one doesnt exist
        if (!user) {
          var newUser = new User({
            name: data.user.name,
            teamId: data.team.id,
            userId: data.user.id,
            sites: []
          });

          newUser.save(function(err) {
            if (err) console.log(err);
            console.log("New user saved");
          });
        }
      });

      // if in development redirect to localhost
      // if in production redirect to live site
      process.env.NODE_ENV === "production"
        ? res.redirect(`/?token=${token}`)
        : res.redirect(`http://localhost:8080/?token=${token}`);
    })
    .catch(err => console.log(err));
});

module.exports = router;
