var express = require("express"),
    mustachio = require("mustachio"),
    app = express.createServer();

app.configure(function() {
  app.register('.mustache', mustachio);
  app.set('view engine', 'mustache');
});

app.get("/", function(req, res) {
  res.render("index", {
    title: "Example Application with Mustachio"
  });
});

app.get("/1", function(req, res) {
  res.render("1", {
    title: "Page 1"
  });
});

app.get("/2", function(req, res) {
  res.render("2");
});

app.get("/3", function(req, res) {
  res.render("3");
});


app.listen("3000");
console.log("Example application with Mustachio running on port 3000.");
