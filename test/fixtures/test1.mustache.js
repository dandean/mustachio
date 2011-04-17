var View = require("../../index").View;

var Test1 = module.exports = View.create({
  initialize: function() {
    // Optional initialization method...
    // You could, for instance, modify the values in __data at init time.
  },
  value: function() {
    return this._data.value.toUpperCase();
  }
});
