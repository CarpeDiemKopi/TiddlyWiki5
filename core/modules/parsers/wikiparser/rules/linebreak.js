/*\
/*\
title: $:/core/modules/parsers/wikiparser/rules/linebreak.js
type: application/javascript
module-type: wikirule

Wiki text rule for linebreaks. For example:

```
.This text will terminated with <br/>
```

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "linebreak";
exports.types = {block: true};

exports.init = function(parser) {
	this.parser = parser;
	// Regexp to match and get language if defined
	this.matchRegExp = /([\.]+)|([ ]{2,}$)/mg;
};

exports.parse = function() {
	var reEnd = /(\r?\n)/mg,
		tree = [],
		match;
	// Move past the match
	this.parser.pos = this.matchRegExp.lastIndex;
	do {
		// Parse the run up to the terminator
		tree.push.apply(tree,this.parser.parseInlineRun(reEnd,{eatTerminator: false}));
		// Redo the terminator match
		reEnd.lastIndex = this.parser.pos;
		match = reEnd.exec(this.parser.source);
		if(match) {
			this.parser.pos = reEnd.lastIndex;
			// Add a line break if the terminator was a line break
			if(match[2]) {
				tree.push({type: "element", tag: "br"});
			}
		}
	} while(match && !match[1]);
	// Return the nodes
	return tree;
};

})();
