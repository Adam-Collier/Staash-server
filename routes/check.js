var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
var request = require("request");
var http = require("http");

router.post("/", function(req, res) {
  // fetch the url from the requests body
  // fetch(req.body.u, {
  //   cors: "no-cors"
  // })
  //   .then(response => {
  //     return response.status;
  //   })
  //   .then(response => {
  //     res.sendStatus(response);
  //   })
  //   .catch(err => {
  //     if (err) {
  //       res.sendStatus(404);
  //     }
  //   });

  request({ url: req.body.u, method: "HEAD" }, function(err, response) {
    if (err) console.log(err, "this is an error");
    res.sendStatus(response.statusCode);
  });
});

module.exports = router;
