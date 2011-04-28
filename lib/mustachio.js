var mustache = require("mustache");

var cache = {};

exports.clearCache = function(){
  cache = {};
};


/**
 * compile(str[, options]) -> String
 * - str(String): A mustache template (in String format)
 * - options(Object): An optional hash of options
 *
 * Compiles the given string of mustache into a Function for rendering later.
 *
 * **Options**
 *
 * - locals(Object):   Local variables object
 * - helper(Object):   View helper functions and properties
 * - cache(Boolean):   Should we cache the mustache template? Requires `filename`
 * - filename(String): Used by `cache` to key caches
 *
 * **Notes**
 *
 * Express caches everything for us, so there's no need to provide the `cache`
 * or `filename` options if unless you're using this method outside of Express'
 * `response.render()` method.
**/
var compile = exports.compile = function(str, options) {
  options = options || {};
  
  // Grab cached helper if present, or provided Helper if present.
  var helper = options.helper,
      filename = options.filename,
      logging = options.logging;
  
  if (options.cache && !filename) {
    throw new Error('"cache" option requires "filename".');
  }
  
  // Is caching enabled?
  if (options.cache && filename && cache[filename]) {
    // Return the cached template
    return cache[filename];
  }

  // If no helper in options, check for and load the Helper object file...
  if (!helper && filename && process && process.title == "node") {
    // Load the file from disk if possible...
    var path = require("path"),
        helperPath = filename + ".js"; // mytemplate.mustache.js

    // TODO: Before checking for the helper path, we should check for the
    // TODO: actual view path... what it that is fake?
    if (path.existsSync(helperPath)) {
      // Load the helper...
      helper = require(helperPath);
      if (logging) console.log("Loading helper from disk: ", helper);
    }
  }
  
  var render = function(data){
    // If Express is configured to cache views (app.set('cache views', true);),
    // this render method will be cached.
    if (logging) console.log("Rendering: ", helper);

    if (options.partial && typeof options.partial == "function") {
      var matchesPartial = /\{\{>[ ]{0,}(\w+)[ ]{0,}\}\}/g;
      if (matchesPartial.test(str)) {
        var partialStaches = str.match(matchesPartial);
        var replaced = [];
        for (var i=0; i<partialStaches.length; i++) {
          var token = partialStaches[i].replace(matchesPartial, "$1");
          if (replaced.indexOf(token) == -1) {
            replaced.push(token);
            str = str.replace(new RegExp("{{>[ ]{0,}" + token + "[ ]{0,}}}", "g"), options.partial(token, options));
          }
        }
      }
    }

    return mustache.to_html(str, loadHelper(helper, data));
  };

  if (options.cache && filename) {
    cache[filename] = render;
  }
  
  return render;
};


/**
 * render(str[, options]) -> String
 * - str(String): A mustache template (in String format)
 * - options(Object): An optional hash of options
 *
 * Render the String `str` of mustache using the provided data
 *
 * **Options**
 *
 * - locals(Object):   Local variables object
 * - helper(Object):   View helper functions and properties
 * - cache(Boolean):   Should we cache the mustache template? Requires `filename`
 * - filename(String): Used by `cache` to key caches
 *
 * **Notes**
 *
 * Express caches everything for us, so there's no need to provide the `cache`
 * or `filename` options if unless you're using this method outside of Express'
 * `response.render()` method.
**/
exports.render = function(str, options) {
  options = options || {};
  var data = (options.locals) ? options.locals : {} ;
  var fn = compile(str, options);
  return fn(data || {});
};

// PRIVATE

/**
 * loadHelper(helper, data) -> helper
 * - helper(Object): Helper object used by the template
 * - data(Object): Source data which populates the helper
 *
 * Loads the helper object using the data object as the source. If `data` contains
 * properties not found on `helper`, and getter/setter is created to access it from
 * `helper`'s internal data store.
 *
 * Known Express options are not applied to the root-level of `helper`, but are
 * accessible from the internal `_env` object: `this._env.filename`.
**/
function loadHelper(helper, data) {
  // Clone the helper before use, and use a default empty helper if not provided.
  helper = Object.create(helper || {});

  helper._data = {};
  helper._env = {};

  // Filter Express data out of the root-level helper data.
  filter : for(var key in data) {
    switch (key) {
      case "layout":
      case "scope":
      case "parentView":
      case "root":
      case "defaultEngine":
      case "settings":
      case "app":
      case "partial":
      case "filename":
        helper._env[key] = data[key];
        continue filter;
      default: break;
    }
    
    helper._data[key] = data[key];
    
    if (typeof helper[key] == "undefined") {
      // Create get/set properties pointing from the helper -> helper._data for any
      // properties *not* overridden by the helper object.
      (function(key) {
        Object.defineProperty(helper, key, {
          get: function() { return helper._data[key]; },
          set: function(value) { helper._data[key] = value; },
          enumerable : true
        });
      })(key);
    }
  }
  
  if (helper.initialize) helper.initialize();
  return helper;
}
