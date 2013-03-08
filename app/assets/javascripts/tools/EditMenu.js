//================================================================================
// This implementation is depend on the fact that ImageData object is
// copy of the real data at getImageData method called.
// Any method of context object like stroke or fill or e.t.c. does not effect
// a change of ImageData got by getImageData method or used by putImageData method.
//=================================================================================

//*********************************************************************************
// README
// canvasのundo, redoをサポートするライブラリ(ついでにcut/copy-pasteも).
// "snapshot"メソッドで履歴をとる.
// 履歴は各canvas毎に管理される.
// 他のツールを使ってcanvasを編集した場合，そのことをライブラリに伝えるために、
// "edit"メソッドを呼ぶ必要がある.
// "edit"が呼び出されない場合，"snapshot"メソッドで履歴が残らなかったり，
// "undo", "redo"が正しく動作しなくなる.
//
// ・初期化
// $('canvas').EditMenu();
// あるいは
// $('canvas').EditMenu("init");
// 初期化オプションはない.
//
// ・保存
// $('canvas').EditMenu("snapshot");
//
// ・canvasが変更されたことを宣言する.
// $('canvas').EditMenu("edit");
//
// ・undo
// $('canvas').EditMenu("undo");
//
// ・redo
// $('canvas').EditMenu("redo");
//
// ・copy
// $('canvas').EditMenu("copy");
//
// ・cut
// $('canvas').EditMenu("cut");
//
// ・paste
// $('canvas').EditMenu("paste");
// copy/cut-pasteに使われるクリップボードは全てのcanvasで共通で，最新の一つ
// のみを保存する.
// copy/cut-pasteは原点を揃えて行われる.したがって，canvasのサイズが異なる場合
// 左上の一部のみに貼り付けられたり，左上の一部のみが貼り付けられる.
// paste位置の指定は未実装
//*********************************************************************************

(function($){
	var undefined; // undefined === undefined
	var clipboard = null;
	var debug = 0;

	var check = function(cxt){
		if(!cxt){
			console.error("could not get a context object: ", cxt);
		}
	};

	var update = function(canvas){
		//canvasの状態をstoreと同じにする
		//console.log("update");
		var cxt = canvas.getContext('2d');
		check(cxt);

		canvas.dirty = false;
		cxt.putImageData(canvas.store, 0, 0);

		return canvas;
	};

	var snapshot = function(canvas){
		//canvasの状態をstoreに保存する
		//console.log("snapshot");
		var cxt = canvas.getContext('2d');
		check(cxt);

		canvas.dirty = false;
		var img = cxt.getImageData(0, 0, canvas.width, canvas.height);
		img.undo = canvas.store;
		if(canvas.store){
			canvas.store.redo = img;
		}
		canvas.store = img;
	
		return canvas;
	};

	var copy = function(canvas){
		//canvasの状態をclipboardに保存する
		var cxt = canvas.getContext('2d');

		check(cxt);
		clipboard = cxt.getImageData(0, 0, canvas.width, canvas.height);

		return canvas;
	};

	var clear = function(canvas){
		//canvasの状態を白紙にする
		var cxt = canvas.getContext('2d');
		check(cxt);
		
		var img = cxt.createImageData(canvas.store);
		img.undo = canvas.store;
		if(canvas.store){
			canvas.store.redo = img;
		}
		canvas.store = img;

		update(canvas);
		return canvas;
	};

	var init = function(settings){
		//console.log(this);
		if(settings){
			this.store = settings.store || null;
			this.dirty = settings.dirty || true;
			clipboard = settings.clipboard || clipboard;
			if( settings.callback !== undefined ){
				this.EditMenuCallback = settings.callback;
			}
		}else{ //by defalut
			this.store = null;
			this.dirty = true;
		}
	 return this;
	};

	var edit = function(){
		this.dirty = true;
		return this;
	};

	var isDirty = function(){
		this.dirty;
		return this;
	};

	/*
	var count = function(){
		var func;
		func = function(n, img){
			if(img){
				func(n+1, img.undo);
			}else{
				return n;
			}
		}
		var num = func(0, this.store);
		if(!this.dirty){
			num -= 1;
		}
		console.log(num);
		return num;
	};

	var strip = function(num){
		if(!this.dirty){
			num += 1;
		}
		if(num == 0){
			this.store = null;
		}

		var fun;
		fun = function(n, img){
			if(!img){
				console.log("under flow");
			}
			if(n == 1){
				img.undo = null;
			}else{
				fun(n-1, img.undo);
			}
		};
		fun(num, this.store);
	};
	*/

	var undo = function(){
		if(this.dirty){
			snapshot(this);
		}
		if(this.store.undo){
			this.store = this.store.undo;
			update(this);
		}

		return this;
	};

	var isUndoable = function(){
		if(this.dirty){
			return this.store;
		}else{
			return this.store.undo;
		}
	};

	var redo = function(){
		if(!this.dirty){
			if(this.store.redo){
				this.store = this.store.redo;
				update(this);
			}
		}
		return this;
	};

	var isRedoable = function(){
		if(this.dirty){
			return false;
		}else{
			return this.store.redo;
		}
	};

	var cut = function(){
		if(this.dirty){
			snapshot(this);
		}
		copy(this);
		clear(this);

		return this;
	};

	var paste = function(){
		if(clipboard){
			if(this.dirty){
				snapshot(this);
			}
			clipboard.undo = this.store;
			this.store.redo = clipboard;
			this.store = clipboard;
			update(this);
			copy(this);  //clipboardのオブジェクトを独立させるのに必要
		}

		return this;
	};
	
	var methods = {
		"init":init,
		"snapshot":function(){ if(this.dirty){ return snapshot(this); } },
		//"strip":strip,
		//"count":count,
		"edit":edit,
		"undo":undo,
		"redo":redo,
		"copy":function(){ return copy(this); },
		"cut":cut,
		"paste":paste,
		//"isDirty":isDirty,
		//"isUndoable":isUndoable,
		//"isRedoable":isRedoable
	};

	$.fn.EditMenu = function(method, options){
		if(method == undefined){
			method == 'init';
		}

		var settings = {};

		if(options){
			$.extend( settings, options );
		}

		if( typeof method === 'object' ){
			$.extend( settings, method );
		}

		return this.each(function(){
			//this == canvas object
			var varout;
			if( methods[method] ){
				varout = methods[method].apply( this, Array(settings) );
			}else if( typeof method === 'object' || ! method ){
				varout =  methods.init.apply( this, Array(settings) );
			}else{
				$.error( 'Method ' + method + ' does not exist on jQuery.EditMenu' );
			}

			if( settings.callback ){
				settings.callback(method);
			}else if( this.EditMenuCallback ){
				this.EditMenuCallback(method);
			}

			return varout;
		});
	};
})(jQuery);
