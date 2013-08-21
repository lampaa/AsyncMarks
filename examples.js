/**
 * MIT, https://github.com/lampaa
 *
 * AsyncMarks - examples
 */

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


/**
 * console.log:
 *
 * 300ms: first timeout complete, 300ms
 * 700ms: third timeout complete, 700ms
 * 1300ms: second timeout complete, 1300ms AND all marks complete
 */
 
 