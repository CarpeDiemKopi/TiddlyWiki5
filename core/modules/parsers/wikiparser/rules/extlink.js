/*\
title: $:/core/modules/parsers/wikiparser/rules/extlink.js
type: application/javascript
module-type: wikirule

Wiki text inline rule for external links. For example:

```
An external link: https://www.tiddlywiki.com/

A suppressed external link: ~http://www.tiddlyspace.com/
```

External links can be suppressed by preceding them with `~`.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "extlink";
exports.types = {inline: true};

exports.init = function(parser) {
	this.parser = parser;
	// Regexp to match
	// this.matchRegExp = /~?(?:file|http|https|mailto|ftp|irc|news|data|skype):[^\s<>{}\[\]`|"\\^]+(?:\/|\b)/mg;
    // https://stackoverflow.com/questions/185510/how-can-i-concatenate-regex-literals-in-javascript
    var ext1 = new RegExp(/~?(?:file|http|https|mailto|ftp|irc|news|data|skype):[^\s<>{}\[\]`|"\\^]+(?:\/|\b)/mg)
    var ext2 = new RegExp(/\bnpp:[^ (){}\]\["'!,;`´]+\b)
    var flags = (ext1.flags + ext2.flags).split("").sort().join("").replace(/(.)(?=.*\1)/g, "")
    this.matchRegExp = new RegExp(ext1.source + "|" + ext2.source, flags);
};

exports.parse = function() {
	// Move past the match
	this.parser.pos = this.matchRegExp.lastIndex;
	// Create the link unless it is suppressed
	if(this.match[0].substr(0,1) === "~") {
		return [{type: "text", text: this.match[0].substr(1)}];
	} else {
		return [{
			type: "element",
			tag: "a",
			attributes: {
				href: {type: "string", value: this.match[0]},
				"class": {type: "string", value: "tc-tiddlylink-external"},
				target: {type: "string", value: "_blank"},
				rel: {type: "string", value: "noopener noreferrer"}
			},
			children: [{
				type: "text", text: this.match[0]
			}]
		}];
	}
};

})();
