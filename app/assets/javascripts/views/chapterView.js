
ChapterView = ecomakiView.extend({
  //el : '#content',
  className : 'chapter' ,
  tmplId: "#chapter_template",
  childViewType: EntryView,
  elementList: ".entryList",


  onInit: function(args){

  _.bindAll(this,
              "addEntry",
              "addEntryWithOrder",
              "addEntryFromTemplate",
              "addEntryFromTemplateAfter",
              "addEntryToTemplate",
              //"addEntryWith1Character",
              //"addEntryWith2Character",
              //"addEntryWithBalloon",
              "onLoad",
              "onSortStart",
              "onSortStop",
              "addChapter",
              "removeChapter",
              "onBackgroundButton",
              "onMusicButton",
              "showBackground",
              "setBackground",
              "setBgm"
              );
    this.model.entries.bind('add', this.addOne);
    this.model.entries.bind('refresh', this.addAll);
    //this.model.entries.bind('change', this.onChange);
    //this.model.entries.bind('add', this.onSync); 
    //this.model.bind('add', this.onSync); 

    this.childModels = this.model.entries.models;
  },

  onRemove: function() {
    this.model.entries.unbind('add', this.addOne);
    this.model.entries.unbind('refresh', this.addAll);
  },

  onChangeEntries: function() {
     console.log(this.model.entries.length);
  },

  events: {
    "keypress #inputform" : "onKeyPress",
    //'click': 'onViewClick',
    "click .add_chapter" : "addChapter",
    "click .new_chapter_handle" : "addChapter",
    "click .first_new_entry_handle" : "addEntryFromTemplate",
    //"click .new_entry_handle" : "addEntry",
    //"click .new_entry_handle" : "addEntryFromTemplate",
    //"click .add_one_char" : "addEntryWith1Character", 
    //"click .add_two_char" : "addEntryWith2Character", 
    //"click .add_description" : "addEntryWithBalloon",
    "click .background_icon" : "onBackgroundButton",
    "click .music_icon" : "onMusicButton",
    "click .remove_chapter" : "removeChapter",
  },

  onCheckStatus: function(){
      if( this.model.entries.length == 0 && this.parentView.model.initFlag !== true ){
        // need wait true option to make isNew entry option time 
        //console.log(this.parentView.model.initFlag);
        var newEntry = this.model.create_entry({"width": 640 ,"height": 480});
        //this.model.entries.save();
      }

  },

  onLoad: function(){
    var self = this;

    this.addAll();
    //$(this.el).width(600);

    if(this.isEditable){
      this.setEditable('.title','title');
      this.setEditable('.description','description');

      $('.entryList',this.el).sortable({
          handle: '.hide_buttons',
          start: this.onSortStart,
          stop: this.onSortStop
        });
      
      //set click function to avoid conflict to entry item add handle in each entry
      //$('.chapter_wrapper',this.el).children('.new_entry_handle').click(this.addEntry);
    }else{
      $(".editer_item",this.el).hide();
    }

    this.onCheckStatus();

    this.render();
    return this;

  },

  render: function(){
    // render all chapter if iseditable
    if(this.isLoaded || this.isEditable){
      //console.log("chapter render");
      
      if(!this.isEditing){
        $('.title',this.el).html(this.model.get('title'));
        $('.description',this.el).html(this.model.get('description'));
      }

      if(this.isDisplay) { 
        this.showBackground();
        //this.playMusicById(this.model.get('chapter_sound_id'));
      }
      
    }
    return this;
  },

  onAddChild: function(view){
    view.load();
  },

  showBackground: function(){
    var img = new Image();
    var window_size = config.getScreenSize();
    var src = config.background_idtourl(this.model.get('background_image_id'));
    img.src = src;
    var self = this;

    $(img).load(
      function(){
        // 
        var $current_bg;

    if( (self.model.get('order_number') % 2) == 1) {
      $current_bg = $('#background_odd')
        .attr("src",src).stop(true,true).hide().fadeIn('slow')
      $('#background_even').stop(true,true).fadeOut('slow');
    }else{
      $current_bg =$('#background_even')
        .attr("src",src).stop(true,true).hide().fadeIn('slow')
      $('#background_odd').stop(true,true).fadeOut('slow');
    }

        var scale = Math.min  ( window_size.y / img.height ,  window_size.x / img.width )  ;
        $current_bg
          .width( scale *  img.width )
          .height( scale * img.height)
          .css({
              'left': '50%',
              'margin-left': -scale *  img.width /2 + 'px',
              'top': '50%',
              'margin-top': -scale * img.height/2 + 'px' 
              //left: window_size.mx - scale *  img.width /2 , 
              //top : window_size.my - scale * img.height/2 ,
     //         width :  scale *  img.width / window_size.y * 100 + '%' ,
     //         height :  scale *  img.height / window_size.x * 100 + '%' 
            });
      }
    );
  },

  onDisplay: function(){
    //console.log('isDisplayed');
    this.showBackground();
    this.playMusicById(this.model.get('background_music_id')); 
    return this;
  },


  addEntryWithOrder: function(attr, i){
    var entry = this.model.entries.create_after(attr,i);
    return entry;
  },


  addEntry: function(){
    var self = this;
    var attr ={"canvas_index":1,"height":320,"width":480};  
    //call trigger of onadd calllback 
    this.model.entries.create_after(attr,-1,{callback:function(){ 
        $(self.el).trigger('onAdd'); 
        $('.new_entry_handle',self.el).trigger('onAdd'); 
      }});
  },

  // add entry with no boder balloon
  addEntryFromTemplate: function(){
    //console.log("from tmp");
    //四コマのウチの何コマ目をてんぷれにするか
    var type = this.model.entries.length % 4;//トップのアイテムの更新だが、常に同じなのはアレなので
    this.model.entries.create_after( EntryTemplate.prototype.getTemplate(type) , -1);
  },

  addEntryFromTemplateAfter: function(){
    var type = this.model.entries.length % 4;//トップのアイテムの更新だが、常に同じなのはアレなので
    this.model.entries.create_after( EntryTemplate.prototype.getTemplate(type) ,  this.model.entries.length-1 );
  },

  addEntryToTemplate: function(){
    //四コマのウチの何コマ目をてんぷれにするか
    for( var i =0; i < this.model.entries.length; i++){
      attr = this.model.entries.at(i).dup();
      EntryTemplate.prototype.addToTemplate( attr ,i);
    }
  },
/*
  // add entry with no boder balloon
  addEntryWithBalloon: function(){
    this.model.entries.create( EntryTemplate.prototype.getTemplate(0) );
  },

  addEntryWith1Character: function(){
    this.model.entries.create( EntryTemplate.prototype.getTemplate(1) );
  },

  addEntryWith2Character: function(){
    this.model.entries.create( EntryTemplate.prototype.getTemplate(2) );
  },
*/
  addChapter: function(e){
    //var novel = this.parentView.model;
    //var currentIndex = novel.chapters.indexOf(this.model);
    //novel.chapters.create_after({},currentIndex);
    this.model.collection.create_after({},this.model.get('order_number'));
  },

  removeChapter: function(e){
    if ( confirm("章全体を削除します。よろしいですか？ Are you sure to remove this chapter?") ){
      
      this.model.destroy();
    }
  },

  
  onSortStart: function(e,ui){
    //console.log('onsort');
    this.sortItemIndex =  $(ui.item).parent().children().index(ui.item);
    // console.log(e.target);
    $('.ui-sortable-helper',this.el).css( {'margin-left': '200px' } );
  },

  onSortStop: function(e,ui){
    //console.log('onsortstop');
    var i =  $(ui.item).parent().children().index(ui.item);
    //console.log(i);
    var entry = this.model.entries.at(this.sortItemIndex);
    var dest = this.model.entries.at(i);
    //console.log(entry);
    this.model.entries.move_at(entry, i);
    this.model.entries.save();
    this.model.trigger('change');
    //this.model.fetch();
  },

  click: function(){
     //console.log("chapter click");
  },

  onKeyPress: function (e){
    //console.log("onkeypress");
    alert(e.whitch );
    if(e.which == 13){
      $('#inputform').val("");
    }
  },

  onBackgroundButton: function(ev){
    Picker.prototype.showBackgroundList(this.setBackground);
    // to stop  blur picker at on ecomakiView Click 
    // TEMP?
    ev.stopPropagation();
  },

  setBackground: function(id){
    console.log('change bg');
    this.model.set('background_image_id',id);
    this.model.save();
    //$('#background')[0].src = config.background_idtourl(id);
    if( (this.model.get('order_number') % 2) == 1 ){
      $('#background_odd')[0].src = config.background_idtourl(this.model.get('background_image_id'));
    }else{
      $('#background_even')[0].src = config.background_idtourl(this.model.get('background_image_id'));
    }
  },

  onMusicButton: function(ev){
    Picker.prototype.showMusicList(this.setBgm);
    // to stop  blur picker at on ecomakiView Click 
    // TEMP?
    ev.stopPropagation();
  },

  setBgm: function(bgm_id){
    this.model.set('background_music_id',bgm_id);
    this.model.save();
    this.playMusicById(bgm_id);
  },

  playMusicById: function(music_id) {
      //console.log(music_id);
      if (music_id !== null && music_id > -1 ) {
          //console.log(+music_id);
          window.musicPlayer.playURL(config.music_idtourl(music_id));
      } else {
          window.musicPlayer.stop();
      }
  }
});
