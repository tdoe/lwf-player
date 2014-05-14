global.LWF.Script = global.LWF.Script || {};
global.LWF.Script["neko"] = function() {
	var LWF = global.LWF.LWF;
	var Loader = global.LWF.Loader;
	var Movie = global.LWF.Movie;
	var Property = global.LWF.Property;
	var Point = global.LWF.Point;
	var Matrix = global.LWF.Matrix;
	var Color = global.LWF.Color;
	var ColorTransform = global.LWF.ColorTransform;
	var Tween = global.LWF.Tween;
	var _root;

	var fscommand = function(type, arg) {
		if (type === "event") {
			_root.lwf.dispatchEvent(arg, this);
		} else {
			throw Error("unknown fscommand");
		}
	};

	var trace = function(msg) {
		console.log(msg);
	};

	var Script = (function() {function Script() {}

	Script.prototype["init"] = function() {
		var movie = this;
		while (movie.parent !== null)
			movie = movie.parent.lwf.rootMovie;
		_root = movie;
	};

	Script.prototype["destroy"] = function() {
		_root = null;
	};

	Script.prototype["_root_0_2"] = function() {
		/**/
		this.stop();
		
		//effect
		this.mloader.regist(
			'nekochild',
			'nekochild',
			''
		);
		
		var self = this;
		
		console.log(this.lwf.privateData.lwfLoader);
		
		this.mloader.updateLoader(this.lwf.privateData.lwfLoader);
		this.mloader.completeFunc = function () {
				console.log('<<---  load all complete  --->>');
				var lwf = self.mloader.gets('nekochild');
				self.kani.attachLWF(lwf, 'nekochild', {});
				
				self.kani.loading = 'complete';
			}
	};

	Script.prototype["_root_0_btn_x0_y0_press"] = function() {
		/**/
		
		this.kani.loading = 'loading...';
		
		//resourse load
		this.mloader.load();
	};

	Script.prototype["clips_other_loaderCorrector_load"] = function() {
		/**/
		
		
			var lwf = this.lwf;
			var self = this;
		
			self.contents = {};
			self.completeFunc = '';
			self.completeThisObj = this;
			self.loadCounter = 0;
			self.loader = '';
			
			//loaderを設定
			self.updateLoader = function(loader){
				if(loader){
					self.loader = loader;
				}
			}
			
			
			//ロードコンテンツの格納用オブジェクトの登録
			//
			self.regist = function (key, mPath, mImageMap) {
				self.contents[key] = {
					path: mPath,
					imageMap: mImageMap,
					lwf: ''
				};
				self.loadCounter ++;
			}
			
			//
			//
			self.load = function () {
				
				var loadLWF = function (key) {
					var path = self.contents[key].path;
					var im = self.contents[key].imageMap;
					var pd = {};
					
					self.loader.loadLWF(lwf, path, im, pd, function (err, lwf) {
						
						console.log(self);
						console.log(self.contents);
						console.log(self.contents[key]);
						console.log(self.contents[key].lwf);
						
						self.contents[key].lwf = lwf;
						self.loadCounter --;
						if(self.loadCounter === 0){
							self.allComplete();
						}
					});
				}
				
				var key;
				for(key in self.contents){
					loadLWF(key);
				}
				var loadLWF = null;
		
		
				
		//		var path, im, pd;
		//		for(var key in self.contents){
		//			
		//			path = self.contents[key].path;
		//			im = self.contents[key].imageMap;
		//			pd = {'key':key};
		//			
		//			self.loader.loadLWF(lwf, path, im, pd, function (err, lwf) {
		//				self.contents[lwf.privateData.key].lwf = lwf;
		//				self.loadCounter --;
		//				if(self.loadCounter === 0){
		//					self.allComplete();
		//				}
		//			});
		//		}
			}
			
			//
			//
			self.allComplete = function () {
				if(self.completeFunc) self.completeFunc.call(self.completeThisObj);
			}
			
			self.gets = function (key) {
				if(self.loadCounter !== 0) return '';
				if(!self.contents[key])return '';
				return self.contents[key].lwf;
				
			}
	};

	return Script;

	})();

	return new Script();
};
