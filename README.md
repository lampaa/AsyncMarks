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
