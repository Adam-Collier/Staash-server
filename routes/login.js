var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.redirect(
    "https://slack.com/oauth/authorize?client_id=161362817169.304108932706&scope=identity.basic"
  );
});

module.exports = router;
