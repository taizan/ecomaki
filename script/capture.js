var page = require('webpage').create();
var fs   = require('fs');

var system = require('system');

var args = phantom.args;



// ページが読み込まれたら page.onCallback を呼ぶ
page.onInitialized = function() {
  page.evaluate(function() {
    document.addEventListener('DOMContentLoaded', function() {
      window.callPhantom('DOMContentLoaded');
    }, false);
  });
};

var userAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36"; //偽装するUA

//ヘッダのセット
page.customHeaders = {
    'Connection' : 'keep-alive',
    'Accept-Charset' : 'Shift_JIS,utf-8;q=0.7,*;q=0.3',
    'Accept-Language' : 'ja,en-US;q=0.8,en;q=0.6',
    'Cache-Control' : 'no-cache',
    'User-Agent' : userAgent
};

// ページが読み込まれたら登録した関数の配列を順次実行してくれるクラス
var funcs = function(funcs) {
  this.funcs = funcs;
  this.init();
};

funcs.prototype = {
  // ページが読み込まれたら next() を呼ぶ
  init: function() {
    var self = this;
    page.onCallback = function(data){
      if (data === 'DOMContentLoaded') self.next();
    }
  },
  // 登録した関数の配列から１個取り出して実行
  next: function() {
    var func = this.funcs.shift();
    if (func !== undefined) {
      func();
    } else {
      page.onCallback = function(){};
    }
  }
};

// 順次実行する関数
new funcs([
  
  function(){
    console.log(args[0]);
    page.open(args[0]);
  },
  function() {
    var st , url;

    setTimeout(function(){
               page.render(args[1]);
               phantom.exit();
      }, 2000);
  },
    function() {
    phantom.exit();
  }
]).next();
