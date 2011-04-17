var assert = require("assert");
var mustache = require("../index");

module.exports = {
    'test html': function(){
      assert.equal('<p>yay</p>', mustache.render('<p>yay</p>'));
    },
    
    'test simple': function(){
      var html = '<p>dan</p>',
          str = '<p>{{ name }}</p>',
          data = { name: 'dan' };
      
      assert.equal(html, mustache.render(str, { locals: data }));
    },

    'test iteration': function(){
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

    'test properties and computed properties (functions)': function(){
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
    }
};