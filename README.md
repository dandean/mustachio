MUSTACHIO
=========

This project is a **mostly** a convenience wrapper around the original [mustache.js](http://github.com/janl/mustache.js) (Thanks @janl !).


Added Bonus Features
--------------------

### Support for Express.js ###

This project will plug right in to Express.js as a view engine. Just add this project as a dependency to your Express application, then configure your app like so:
    
    var express = require("express"),
        mustachio = require("mustachio"),
        app = express.createServer();

    app.configure(function() {
      // ...
      app.register('.mustache', mustachio);
      app.set('view engine', 'mustache');
      // ...
    });

**Caveat:** due to a bug in older versions of Express, Mustachio will only work with versions 2.2.2+.


#### Express Partials ####

When using Express, Mustachio supports Express' partial file lookup, so using Mustache's partial syntax should just work. For example, if you put this in your template: `{{> rad }}`, you could put your partial template in any of these places:

    ./rad.mustache
    ./_rad.mustache
    ./rad/index.mustache
    ../rad/index.mustache

File lookup is performed in the above order.


### View Helper Objects !!! ###

The one really killer feature of this project is it's support for **view helper objects**. View helper objects allow you to keep your view-rendering logic truly isolated by providing a space for all of your view-specific logic. This keeps your request handlers/controllers clean of view-specific code.

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


#### View Helper Scope ####

One thing to note is how view helper scope works. View helpers only work on their associated views, and are not inherited by parent or child views.


### Examples ###

To see some examples of Mustachio at work, take a peek at the "examples" directory of this module.


### TODO ###

* *Actually* support the browser :)