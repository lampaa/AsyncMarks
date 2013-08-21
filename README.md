AsyncMarks
==========
Download last version: [index.js](index.js "index.js")

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
