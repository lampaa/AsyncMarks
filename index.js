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
			options.debug = !!options.debug || false;
			
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
					throw new Error("Mark has expired");
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
				throw new Error("markName is undefined");
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
		 * sequence of operation
		 */
		series: function() {
			this._fManager(arguments);
			// execute
			this._executeSeriesFunc();
		},
		
		/**
		 * _seriesMaster
		 */		
		_seriesMaster: function() {
			var that = this;
			return {
				complete: function() {
					that.function_list.splice(0, 1);
					that._executeFunc();
				}
			}
		},
		
		/**
		 * _executeSeriesFunc
		 */			
		_executeSeriesFunc: function() {
			if(this.function_list.length > 0) {
				if(!(this.function_list[0] instanceof Function)) {
					throw new Error("Argument is not function.");
				}
				
				this.function_list[0].call(this._seriesMaster());
			}
			else {
				if(this.callback != undefined) {
					this.callback();
				}
			}
		},		
		/**
		 * pack
		 */
		pack: function() {
			this._fManager(arguments);
			// execute
			this._executePackFunc();
		},
		
		/**
		 *
		 */
		_executePackFunc: function() {
			for(var i=0; i < this.function_list.length; i++) {
				this.function_list[i].call(this._packMaster());
			}
		},
		
		/**
		 * _packMaster
		 */
		_packMaster: function() {
			var that = this;
			return {
				complete: function() {
					that.function_list.splice(0, 1);
					
					if(that.function_list.length == 0 && that.callback != undefined) {
						that.callback();
					}
				}
			}
		},
		
		/**
		 * function manager
		 */
		_fManager: function(arguments) {

			this.function_list = [];
			
			// null
			if(arguments.length == 0) {
				throw new Error("Arguments is null.");
			}
			// one function
			else if(arguments.length == 1 && arguments[0] instanceof Function) {
				this.function_list.push(arguments[0]);
			}
			// function list
			else if(arguments.length == 1 && arguments[0] instanceof Array) {
				for(var i=0; i < arguments[0].length; i++) {
					this.function_list.push(arguments[0][i]);
				}
			}
			// arguments list
			else {	
				for(var i=0; i < arguments.length; i++) {
					this.function_list.push(arguments[i]);
				}				
			}		
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
				clearTimeout(this.outTimer);
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
