var mustache = require("./lib/mustache");

/**
 * Compile the given `str` of ejs into a `Function`.
**/
var compile = exports.compile = function(str, options) {
  // Should we load in a View class?
  var View;
  
  if (process && process.title == "node") {
    if (options.filename) {
      var path = require("path"),
          viewPath = options.filename + ".js";
      
      if (path.existsSync(viewPath)) {
        View = require(viewPath);
      }
    }
  }
  
  return function(data){
    if (View) data = new View(data);
    return mustache.to_html(str, data);
  };
};


var cache = {};

exports.clearCache = function(){
  cache = {};
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
  
  var fn = null,
      filename = options.filename,
      // Pull data out of the options, if present
      data = (options.locals) ? options.locals : {} ;
  
  if (options.cache) {
    if (filename) {
      fn = cache[filename] || (cache[filename] = compile(str, options));
    } else {
      throw new Error('"cache" option requires "filename".');
    }
  } else {
    fn = compile(str, options);
  }
  
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
if (require.extensions) {
  require.extensions['.mustache'] = function(module, filename) {
    var source = require('fs').readFileSync(filename, 'utf-8');
    module._compile(compile(source, {filename: filename}), filename);
  };
} else if (require.registerExtension) {
  require.registerExtension('.mustache', function(src) {
    return compile(src, {filename: filename});
  });
}
