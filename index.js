(function() {
	var AsyncMarks = function(options) {
		AsyncMarks.func.init.prototype = AsyncMarks.func;
		return new AsyncMarks.func.init(options);
	}

	AsyncMarks.func = AsyncMarks.prototype = {
		constructor: AsyncMarks,
		init: function(options) {
			/**
			 * init options
			 */
			options = options || {};
			options.timeout = options.timeout || 0;
			
			/**
			 * vars
			 */
			this._markStack = {};
			this.callback;
			
			/**
			 * others
			 */
			if(options.timeout !== 0) {
				this.outTimer = setTimeout(function() {
					throw new Error("Index " + token_value + " of column "+ columns_names[i] +" already exists. Table: " + tableName);
				}, options.timeout);
			}
			
			return this;
		},
		/**
		 * add mark
		 */
		addMark: function(mark) {
			var that = this;
			
			mark = mark || Object.keys(that._markStack).length + '_mark';
			that._markStack[mark] = false;
			
			return {
				complete: function() {
					that.completeMark(mark);
				}
			}
		},
		/**
		 * complete mark
		 */
		completeMark: function(markName) {
			if(markName == undefined) {
				 throw 'mark no name';
			}
			this._markStack[markName] = true;
			this._compteleCall();
		},
		/**
		 * func call with all complete
		 */
		complete: function(callback) {
			this.callback = callback;
			return callback;
		},
		/**
		 *
		 */
		_compteleCall: function() {
			for (prop in this._markStack) {
				if (this._markStack.hasOwnProperty(prop)) {
					if(!this._markStack[prop]) {
						return false;
					}
				}
			}
			if(this.outTimer != undefined) {
				clearInterval(this.outTimer);
			}
			
			this.callback();
		}
	}
	
	if(typeof module !== 'undefined' && module.exports) {
		module.exports = AsyncMarks;
	}
	else {
		window['AsyncMarks'] = AsyncMarks;
	}
}());