var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var cloudinary = require("cloudinary");
var puppeteer = require("puppeteer");
var User = require("../models/User");

router.get("/", function(req, res, next) {
  // check if the user has a valid JSON web token
  jwt.verify(req.headers.token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      res.send(err);
    } else {
      // find the team and send all of their sites in the response
      User.find({ teamId: decoded.teamId }, function(err, teamUsers) {
        if (err) console.log(err);
        teamSites = teamUsers.reduce((acc, curr) => acc.concat(curr.sites), []);
        res.send(teamSites.reverse());
      });
    }
  });
});

router.post("/", (req, res) => {
  jwt.verify(req.headers.token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      res.json({ error: "JSON web token has expired" });
    } else {
      // find user via JWT in the request headers
      User.findOne({ userId: decoded.userId }, function(err, user) {
        if (err) console.log(err);
        // set up config for cloudinary
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_NAME,
          api_key: process.env.CLOUDINARY_KEY,
          api_secret: process.env.CLOUDINARY_SECRET
        });

        // iphone 6 preset
        let iPhone6 = {
          name: "iPhone 6",
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
          viewport: {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false
          }
        };

        // object to store our data
        let siteData = {};

        (async () => {
          try {
            const browser = await puppeteer.launch({
              args: ["--no-sandbox", "--disable-setuid-sandbox"]
            });

            const page = await browser.newPage();

            await page.goto(req.body.siteUrl);

            // grab desktop screenshot
            await page.setViewport({ width: 1440, height: 850 });

            await page.screenshot({ type: "jpeg" }).then(data => {
              cloudinary.uploader.upload(
                `data:image/jpeg;base64,${data.toString("base64")}`,
                result => {
                  //   create an object with the site data
                  let siteProperties = {
                    siteTitle: req.body.siteTitle,
                    siteUrl: req.body.siteUrl,
                    desktopImage: result.secure_url,
                    author: decoded.name,
                    date: new Date().toLocaleDateString()
                  };
                  // add the properties to siteData
                  Object.assign(siteData, siteProperties);
                  return;
                }
              );
            });

            // grab mobile screenshot
            await page.emulate(iPhone6);

            await page
              .screenshot({
                type: "jpeg"
              })
              .then(data => {
                cloudinary.uploader.upload(
                  `data:image/jpeg;base64,${data.toString("base64")}`,
                  result => {
                    //   add mobile image to siteData
                    siteData.mobileImage = result.secure_url;
                    //   concatenate the object onto the existing sites
                    user.sites = user.sites.concat([siteData]);
                    //   save the user
                    user.save(function(err) {
                      if (err) return console.log(err);
                      else {
                        console.log("Site successfully saved");
                        res.send("Site successfully saved");
                      }
                    });
                    return;
                  }
                );
              });
            await browser.close();
          } catch (err) {
            console.error(err);
            res.status(500);
          }
        })();
      });
    }
  });
});

module.exports = router;
