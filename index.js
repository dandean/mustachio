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
var compile = exports.compile = function(str, options) {
  // load view.js class, cach it with the view path name
  // load up the view mustache file, cach it with the view path name
  console.log("!!!");
  console.log(__filename);
  console.log(str);
  console.log(options);
  console.log("????");
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
  var data = (options && options.locals) ? options.locals : {} ;
  return mustache.to_html(str, data);
};
