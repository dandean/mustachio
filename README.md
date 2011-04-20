MUSTACHIO
=========

This project is a **mostly** a convenience wrapper around the original [mustache.js](http://github.com/janl/mustache.js) (Thanks @janl !).


Added Bonus Features
--------------------

### Support for Express.js ###

This project will plug right in to Express.js as a view engine. Just add this project as a dependency to your Express application, then configure your app like so:

    var mustachio = require("mustachio");

    app.configure(function() {
      // ...
      app.register('.mustache', mustachio);
      app.set('view engine', 'mustache');
      // ...
    });


### View Helper Objects !!! ###

The one really kick-ass killer feature of this project is it's support for **view helper objects**. View helper objects allow you to keep your view-rendering logic truly isolated by providing a space for all of your view-specific logic.

When your template is loaded ("**myview.mustache**", for instance), we also check for a corresponding helper file to load (such as "myview.mustache**.js**").

**Example**

myview.mustache

    Name: {{ name }} - Age: {{ age }}

myview.mustache.js

    module.exports = {
      name: function() {
        return this._data.first + " " + this._data.last;
      }
    };

Now let's render that from within express:

    app.get('/', function(req, res){
      res.render("myview", {
        first: "Dan",
        last: "Dean",
        age: 5000
      });
    });

Our template will get rendered using our god damned amazing helper!

    Name: Dan Dean - Age: 5000

