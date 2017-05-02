var assert = require('chai').assert;
var searcher = require('./scripts/search.js');


var jsdom = require('jsdom');
var document = jsdom.jsdom("");
var window = document.defaultView;

$ = require('jquery');
  global.$ = $;


describe('math module', function(){
	describe('#search.sum()', function(){
		it('#sum()' , function(){		
			var search = new searcher();
			assert.equal((search.sum(1,1)),2);
			assert.strictEqual(127+102,229);
		});
	});
});