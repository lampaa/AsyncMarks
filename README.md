AsyncMarks
==========
Download last version: [index.js](index.js "index.js")

Asynchronous markers will allow you to avoid the callback hell and tidy the code.

To create a marker, call the ```addMark()```:
```js
var deferred = AsyncMarks();

// first marker, the completion of the variable.
var firstMark = deferred.addMark();
setTimeout(function() {
	console.log('first timeout complete, 300ms');
	firstMark.complete();
}, 300);

// second marker, completion through the context of the function.
var secondMark = function() {
    var that = this;
    
    setTimeout(function() {
		console.log('second timeout complete, 500ms');
		that.complete();
	}, 500);
};
```
To perform all the functions at once, call the method ```pack(mixed)```:
```js
// complete pack with array of markers
deferred.pack([firstMark, secondMark, ..., nMark]);

// complete pack with arguments of markers
deferred.pack(firstMark, secondMark, ..., nMark);
```
To perform all the functions one by one, call the method ```series(mixed)```:
```js
// complete series with array of markers
deferred.series([firstMark, secondMark, ..., nMark]);

// complete series with arguments of markers
deferred.series(firstMark, secondMark, ..., nMark);
```

To call a function that is performed after the completion of all functions, perform method ```complete()```:
```js
deferred.complete(function() {
	console.log('all marks complete');
});
```

See an example of compiling a template:
```js

var globalDeferred = AsyncMarks();
var globalMarkQuery = globalDeferred.addMark();
var globalMarkTemplate = globalDeferred.addMark();

/**
 * Mysql queries can be run together, because they are not dependent on each other.
 */
var deferredQuery = AsyncMarks();
var mysql = new Mysql(...);
var members = [];
var articles = [];
 
// get members from mysql db
var queryMembers = function() {
	var that = this;
    
	mysql.query("SELECT * FROM members", function(err, data) {
    	members = data;
        that.complete();
    });
}

// get articles from mysql db
var queryArticles = function() {
	var that = this;
    
	mysql.query("SELECT * FROM articles", function(err, data) {
    	articles = data;
        that.complete();
    });
}

deferredQuery.pack(queryMembers, queryArticles);

deferredQuery.complete(function() {
	console.log('query load complete');
    globalMarkQuery.complete();
});

/**
 * Template is compiled from multiple files one by one.
 */
var deferredTemplate = AsyncMarks();
var templateData = [];

var templateHeader = function() {
	var that = this;
	
	fs.load('templateHeader', function(data) {
    		templateData.push(data);
    		that.complete();
	});
}

var templateContent = function() {
	var that = this;
    
	fs.load('templateContent', function(data) {
    		templateData.push(data);
    		that.complete();
	});
}

var templateFooter = function() {
	var that = this;
    
	fs.load('templateFooter', function(data) {
    		templateData.push(data);
    		that.complete();
	});
}

deferredTemplate.series(templateHeader, templateContent, templateFooter);

deferredTemplate.complete(function() {
	console.log('template load complete');
	globalMarkTemplate.complete();
});

/**
 * execute global deffered complete function after load templates and query
 */
globalDeferred.pack(globalMarkQuery, globalMarkTemplate);

globalDeferred.complete(function() {
	var view = new NodeSmarty.assign({
    	'members': members,
        'articles': articles
    }).template(templateData.join(''));
    
    view.fetch();
});
```






