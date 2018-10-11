var express = require("express");
var router = express.Router();
var urlExists = require("url-exists-deep");

router.post("/", function(req, res) {
  urlExists(req.body.u).then(function(response) {
    if (response) {
      console.log("Url exists", response.href);
      res.sendStatus(200);
    } else {
      console.log("Url does not exists!");
      res.sendStatus(400);
    }
  });
});

module.exports = router;
