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
deferred.addMark(function() {
    var that = this;
    
    setTimeout(function() {
		console.log('second timeout complete, 500ms');
		that.complete();
	}, 500);
});
```

The library allows to execute arbitrary code after execute all marks.

Example: 

```js
var deferred = AsyncMarks();
//
var firstMark = deferred.addMark();
setTimeout(function() {
	console.log('first timeout complete, 300ms');
	firstMark.complete();
}, 300);

//
var secondMark = deferred.addMark();
setTimeout(function() {
	console.log('second timeout complete, 1300ms');
	secondMark.complete();
}, 1300);

deferred.addMark('third');
setTimeout(function() {
	console.log('third timeout complete, 700ms');
	deferred.completeMark('third');
}, 700);

deferred.complete(function() {
	console.log('all marks complete');
});
```
