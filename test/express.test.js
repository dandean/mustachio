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
    layout: false,
    cache: true,
    logging: true
  });
  app.use(app.router);
});

app.get('/', function(req, res){
  res.render("test1", { value: "abc" });
});

if (module.parent) {
  module.exports = {
    'express : mustache': function() {
      assert.response(app, { url: '/' },
        { status: 200, body: "ABC" }
      );
    }
  };
} else {
  app.listen(3000);
}

