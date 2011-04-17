var assert = require("assert"),
    mustache = require("../index"),
    assert = require("assert"),
    express = require("express"),
    app = express.createServer();

app.configure(function() {
  app.register('.mustache', mustache);
  app.set('view engine', 'mustache');
  app.set('views', __dirname + '/fixtures');
  app.set('cache views', true);
  app.set('view options', {
    layout: false
  });
  app.use(app.router);
});

app.get('/', function(req, res){
  res.render("test1", { value: "abc" });
});

// TODO: May need to create an express resources folder somewhere
module.exports = {
  'express : mustache': function() {
    assert.response(app, { url: '/' },
      { status: 200, body: "ABC" }
    );
  }
};

// app.listen(3000);
