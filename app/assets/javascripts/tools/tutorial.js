//= require jquery.balloon.min

TutorialBalloon = function(){
  this.current = -1;
  
  $.balloon.defaults.classname = "editer_item";

  this.list = [
    {
      target: ".new_entry_handle",
      action: "onAdd",
      param:{ contents: "<h2>コマを追加してみよう</h2>" }
    },

    {
      target: ".default_item.balloon",
      action: "blur",
      param:{ contents: "<h2>セリフを追加してみよう</h2>" }
    },
    {
      target: ".default_item.character",
      action: "click",
      param:{ contents: "<h2>キャラクターを追加してみよう</h2>" }
    },
    /*
    キャラクターを選択しよう
    画像を選ぼう
    アップロードもできるよ
    ペンで落書きしてみよう
    パレットや
    ペンの大きさ変更
    セリフやキャラクターを操作するときは描画モード解除！
    ドラッグしてコマをソートしてみよう
    アニメーションをかけてみよう
    エフェクトのタイプを選択して
    効果を選択しよう
    アニメーション再生
    リセット
    時間の調節をしてみよう

    */
    {
      target: "#title",
      action: "blur",
      param:{ contents: "<h2>タイトルを入力しよう!</h2>" }
    },
    {
      target: "#author_name",
      action: "blur",
      param:{ contents: "<h2>名前を入力しよう！</h2>" }
    },
     
    {
      target: "#preview_button",
      action: "click",
      param:{
          contents: "<h2>プレヴューしてみよう</h2>",
          position: "bottom",
          css: { position: 'fixed' }
        }
    },
    {
      target: "#publish_button",
      action: "click",
      param:{
          contents: "<h2>公開しよう！</h2>",
          position: "bottom",
          offsetX: 15,
          css: { position: "fixed" },
        }
    }
  ]

  var self = this;
  this.next = function(){
    //現在のバルーンを消して、コールバックを解除
    if(self.currentItem){
      self.currentItem.hideBalloon();
      self.currentItem.off(self.list[self.current].action,self.next); 
    }
    self.current++;
    var i = self.current;
    console.log(i);
    if(i < self.list.length){
      self.currentItem = $($(self.list[i].target)[0])
        .showBalloon(self.list[i].param)
        .on(self.list[i].action,self.next);
        //neec to change action for each item
        //titke for burr or befault item fo click
    }
  }

}

