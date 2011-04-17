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
  var View = (options.cache && options.filename && viewCache[options.filename]) ?
              viewCache[options.filename] : options.View;

  // If no view yet, check for, and load, the View class...
  if (!View && options.filename && process && process.title == "node") {
    // No cached view, load the file from disk if possible...
    var path = require("path"),
        viewPath = options.filename + ".js"; // mytemplate.mustache.js

    if (path.existsSync(viewPath)) {
      // Load the view...
      View = require(viewPath);
    }
  }
  
  var render = function(data){
    if (View) data = new View(data);
    return mustache.to_html(str, data);
  };

  if (options.cache && options.filename) {
    if (View && !viewCache[options.filename]) {
      // Cache the view if caching is enabled...
      // TODO: How does caching the view here affect Express?
      viewCache[options.filename] = View;
    }
    templateCache[options.filename] = render;
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

/**
 * class View
 * new View(data) -> View
 * - data(Object): Data to wrap in the view.
**/
var View = exports.View = function(data) {
  this._data = _data = {};
  var self = this;
  for(var key in data) {
    _data[key] = data[key];
    
    if (typeof this[key] == "undefined") {
      // Make properties on the model instance for all props that are not defined.
      (function(key) {
        Object.defineProperty(self, key, {
          get: function() { return _data[key]; },
          set: function(value) { _data[key] = value; },
          enumerable : true
        });
      })(key);
    }
  }
  
  if (this.initialize) this.initialize();
};

View.create = function(def) {
  var result = function(data) {
    View.call(this, data);
  };
  
  result.prototype = Object.create(View.prototype);

  for (var prop in def) {
    result.prototype[prop] = def[prop];
  }
  
  return result;
};

/**
 * Expose to require().
**/
// if (require.extensions) {
//   require.extensions['.mustache'] = function(module, filename) {
//     var source = require('fs').readFileSync(filename, 'utf-8');
//     module._compile(compile(source, {filename: filename}), filename);
//   };
// } else if (require.registerExtension) {
//   require.registerExtension('.mustache', function(src) {
//     return compile(src, {filename: filename});
//   });
// }
