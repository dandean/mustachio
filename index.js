var mustache = require("./lib/mustache");

var viewCache = {};
var templateCache = {};

exports.clearCache = function(){
  viewCache = {};
  templateCache = {};
};


/**
 * Compile the given `str` of mustache into a `Function`.
**/
var compile = exports.compile = function(str, options) {
  options = options || {};

  // Grab cached view if present, or provided View if present.
  var view,
      filename = options.filename;
  
  if (options.cache && filename && viewCache[filename]) {
    // If caching enabled, and filename provided, check for cached View
    view = viewCache[filename];
  } else {
    // Use the provided View, if provided...
    view = options.view;
  }

  // If no view yet, check for and load the View class file...
  if (!view && filename && process && process.title == "node") {
    // No cached view, load the file from disk if possible...
    var path = require("path"),
        viewPath = filename + ".js"; // mytemplate.mustache.js

    if (path.existsSync(viewPath)) {
      // Load the view...
      view = require(viewPath);
    }
  }
  
  var render = function(data){
    if (view) data = loadView(view, data);
    return mustache.to_html(str, data);
  };

  if (options.cache && filename) {
    if (view && !viewCache[filename]) {
      // Cache the view if caching is enabled...
      // TODO: How does caching the view here affect Express?
      viewCache[filename] = view;
    }
    templateCache[filename] = render;
  }
  
  return render;
};


/**
 * Render the given `str` of mustache.
 *
 * Options:
 *
 *   - `locals`          Local variables object
 *   - `cache`           Compiled functions are cached, requires `filename`
 *   - `filename`        Used by `cache` to key caches
 *
 * @param {String} str
 * @param {Object} options
 * @return {String}
 * @api public
**/
exports.render = function(str, options) {
  options = options || {};
  var data = (options.locals) ? options.locals : {} ;
  var fn = compile(str, options);
  return fn(data || {});
};

// PRIVATE

/**
 * loadView(view, data) -> view
 * - view(Object): View object used by the template
 * - data(Object): Source data which populates the view
 *
 * Loads the view object using the data object as the source. If `data` contains
 * properties not found on `view`, and getter/setter is created to access it from
 * `view`'s internal data store.
 *
 * Known Express options are not applied to the root-level of `view`, but are
 * accessible from the internal `_env` object: `this._env.filename`.
**/
function loadView(view, data) {
  view._data = data;
  view._env = {};

  // Filter Express data out of the root-level view data.
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
        view._env[key] = data[key];
        continue filter;
      default: break;
    }
    
    view._data[key] = data[key];
    
    if (typeof view[key] == "undefined") {
      // Create get/set properties pointing from the view -> view._data for any
      // properties *not* overridden by the view object.
      (function(key) {
        Object.defineProperty(view, key, {
          get: function() { return view._data[key]; },
          set: function(value) { view._data[key] = value; },
          enumerable : true
        });
      })(key);
    }
  }
  
  if (view.initialize) view.initialize.call(view);
  return view;
}
