var mustache = require("./lib/mustache");
var cache = {};

exports.clearCache = function(){
  cache = {};
};

//TODO: example: https://github.com/visionmedia/ejs/blob/master/lib/ejs.js

/**
 * Compile the given `str` of ejs into a `Function`.
 *
 * @param {String} str
 * @param {Object} options
 * @return {Function}
 * @api public
**/
var compile = exports.compile = function(str) {
  // load view.js class, cach it with the view path name
  // load up the view mustache file, cach it with the view path name
  return function(data){
    return mustache.to_html(str, data);
  };
};

/**
 * Render the given `str` of ejs.
 *
 * Options:
 *
 *   - `locals`          Local variables object
 *   - `cache`           Compiled functions are cached, requires `filename`
 *   - `filename`        Used by `cache` to key caches
 *   - `scope`           Function execution context
 *   - `debug`           Output generated function body
 *   - `open`            Open tag, defaulting to "<%"
 *   - `close`           Closing tag, defaulting to "%>"
 *
 * @param {String} str
 * @param {Object} options
 * @return {String}
 * @api public
**/
exports.render = function(str, options) {
  var fn = null,
      // Pull data out of the options, if present
      data = (options && options.locals) ? options.locals : {} ;

  options = options || {};
  
  if (options.cache) {
    if (options.filename) {
      fn = cache[options.filename] || (cache[options.filename] = compile(str));
    } else {
      throw new Error('"cache" option requires "filename".');
    }
  } else {
    fn = compile(str);
  }
  
  return fn(data || {});
};

/**
 * Expose to require().
**/
if (require.extensions) {
  require.extensions['.mustache'] = function(module, filename) {
    source = require('fs').readFileSync(filename, 'utf-8');
    module._compile(compile(source, {}), filename);
  };
} else if (require.registerExtension) {
  require.registerExtension('.mustache', function(src) {
    return compile(src, {});
  });
}
