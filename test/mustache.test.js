var assert = require("assert");
var mustache = require("../index");

module.exports = {
    'html should not be altered when not mustaches present': function(){
      assert.equal('<div>hello there</div>', mustache.render('<div>hello there</div>'));
    },
    
    'simple property should replace associated mustache': function(){
      var html = '<p>dan</p>',
          str = '<p>{{ name }}</p>',
          data = { name: 'dan' };
      
      assert.equal(html, mustache.render(str, { locals: data }));
    },

    'arrays should be iterated': function(){
      var data = {
        people: [
          { name: "dan" },
          { name: "jenny" },
        ]
      };
      var html = '<p>dan</p><p>jenny</p>',
          str = '{{#people}}<p>{{ name }}</p>{{/people}}';
          
      assert.equal(html, mustache.render(str, { locals: data }));
    },

    'sub properties and function-properties should work': function(){
      var data = {
        people: [
          {
            first: "dan",
            last: "dean",
            name: function() {
              return (this.first + " " + this.last).trim();
            },
            education: {
              type: "BFA",
              school: "University of Washington"
            }
          },
          {
            first: "jenny",
            last: "zwick",
            name: function() {
              return (this.first + " " + this.last).trim();
            },
            education: {
              type: "BFA",
              school: "University of Washington"
            }
          },
          {
            name: "itska"
          }
        ]
      };
      var html = '<p>dan dean: BFA from University of Washington</p><p>jenny zwick: BFA from University of Washington</p><p>itska: No Education</p>',
          str = '{{#people}}<p>{{ name }}: {{#education}}{{type}} from {{school}}{{/education}}{{^education}}No Education{{/education}}</p>{{/people}}';
      
      assert.equal(html, mustache.render(str, { locals: data }));
    },
    
    'templates should be cached when `option.cache` is `true`': function() {
      // First call to render should save the result as "please.cache" in the cache.
      assert.equal('<p>dan</p>', mustache.render("<p>{{ name }}</p>", {
        locals: { name: "dan" },
        cache: true,
        filename: "please.cache"
      }));
      
      // Second call to render should ignore the new template, using "please.cache" with new data.
      assert.equal('<p>jenny</p>', mustache.render("!!!", {
        locals: { name: "jenny" },
        cache: true,
        filename: "please.cache"
      }));
    },

    'templates should *not* be cached when `option.cache` is not set': function() {
      // First call to render should save the result as "please.cache" in the cache.
      assert.equal('<p>dan</p>', mustache.render("<p>{{ name }}</p>", {
        locals: { name: "dan" },
        filename: "please.cache"
      }));
      
      // Second call to render should ignore the new template, using "please.cache" with new data.
      assert.equal('!!!', mustache.render("!!!", {
        locals: { name: "jenny" },
        filename: "please.cache"
      }));
    },
    
    'when cache option present, a filename option is required': function() {
      // First call to render should save the result as "please.cache" in the cache.
      assert.throws(function() {
        mustache.render("", { cache: true });
      });
    },
    
    'helper option object should be used as view helper': function() {
      assert.equal("<p>DAN</p>", mustache.render("<p>{{ name }}</p>", {
        locals: { name: 'dan' },
        helper: {
          name: function() {
            return this._data.name.toUpperCase();
          }
        }
      }));
      
    }
};