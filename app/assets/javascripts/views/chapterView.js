//= require ./entryTemplate

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
              "addEntryWith1Character",
              "addEntryWith2Character",
              "addEntryWithBalloon",
              "onLoad",
              "onSortStart",
              "onSortStop",
              "addChapter",
              "removeChapter",
              "onBackgroundButton",
              "onMusicButton",
              "showBackground",
              "setBackground",
              "setBgm");
    this.model.entries.bind('add', this.addOne);
    this.model.entries.bind('refresh', this.addAll);
    this.model.entries.bind('change', this.onChange);

    this.childModels = this.model.entries.models;
  },

  events: {
    "keypress #inputform" : "onKeyPress",
    //'click': 'onViewClick',
    "click .add_chapter" : "addChapter",
    //"click .add_entry" : "addEntry",
    "click .add_one_char" : "addEntryWith1Character", 
    "click .add_two_char" : "addEntryWith2Character", 
    "click .add_description" : "addEntryWithBalloon",
    "click .background_icon" : "onBackgroundButton",
    "click .music_icon" : "onMusicButton",
    "click .remove_chapter" : "removeChapter",
  },

  onLoad: function(){
    var _self = this;

    this.addAll();

    if(this.isEditable){
      $('.title',this.el).click( function(){ editableTextarea(this,_self.saveTitle); });
      $('.description',this.el).click( function(){ editableTextarea(this,_self.saveDescription); });
    
      //$('.background_select',this.el).change( function(){ _self.setBackground( $(this).val() );} );
      //this.initBackgroundList();
      //$('.bgm_select',this.el).change( function(){ _self.bgmSelect( $(this).val() );} );
    }else{
      $(".editer_item",this.el).hide();
    }

    this.render();
    return this;
  },

  onAddChild: function(view){
    view.load();
  },

  showBackground: function(){
    if( (this.model.get('order_number') % 2) == 1) {
      $('#background_odd')[0].src = config.background_idtourl(this.model.get('background_image_id'));
      $('#background_odd').show('fade','slow');
      $('#background_even').hide('fade','slow');
    }else{
      $('#background_even')[0].src = config.background_idtourl(this.model.get('background_image_id'));
      $('#background_even').show('fade','slow');
      $('#background_odd').hide('fade','slow');
    }
  },

  onDisplay: function(){
    //console.log('isDisplayed');
    console.log(this.model.get('order_number') % 2);

    this.showBackground();

    this.playMusicById(this.model.get('background_music_id')); 
    return this;
  },



  addEntryWithOrder: function(json, i){
    var attr = EntryView.prototype.deleteAttr(json); 
    var entry = this.model.entries.create_after(attr,i,
        { wait:true,
          success: function(){
              var j = 0;
              console.log("addEntry Success");
              for(j = 0; j < attr.entry_balloon.length; j++ ){
                entry.balloons.create(attr.entry_balloon[j]);
              }
              for(j = 0; j < attr.entry_character.length; j++){
                entry.characters.create( attr.entry_character[j]);
              }
              entry.save();
              entry.trigger('change');
            }
        });
    return entry;
  },

  addEntry: function(json){
    var attr = EntryView.prototype.deleteAttr(json); 
    var entry = this.model.entries.create(attr,
        { wait:true,
          success: function(){
              var j = 0;
              console.log("addEntry Success");
              for(j = 0; j < attr.entry_balloon.length; j++ ){
                entry.balloons.create(attr.entry_balloon[j]);
              }
              for(j = 0; j < attr.entry_character.length; j++){
                entry.characters.create( attr.entry_character[j]);
              }
              entry.save();
              entry.trigger('change');
            }
        });
    return entry;
  },

  // add entry with no boder balloon
  addEntryWithBalloon: function(){
    this.addEntry( EntryTemplate.prototype.getTemplate(0) );
  },

  addEntryWith1Character: function(){
    this.addEntry( EntryTemplate.prototype.getTemplate(1) );
  },

  addEntryWith2Character: function(){
    this.addEntry( EntryTemplate.prototype.getTemplate(2) );
  },

  addChapter: function(e){
    //var chapter = this.parentView.model;
    //var currentIndex =  chapter.entries.indexOf(this.model);
    //var attributes = { height: 320, width: 640, canvas_index: 1 };
    //chapter.entries.create_after(attributes, currentIndex);
    
    console.log("addChapter");
    var novel = this.parentView.model;
    var currentIndex = novel.chapters.indexOf(this.model);
    novel.chapters.create_after({},currentIndex);
  },

  removeChapter: function(e){
    $(this.el).remove();
    this.model.destroy();
  },

  render: function(){
    // render all chapter if iseditable
    if(this.isLoaded || this.isEditable){
      console.log("chapter render");

      $('.title .text',this.el).html(this.model.get('title'));
      $('.description .text',this.el).html(this.model.get('description'));

      if(this.isDisplay) { 
        this.showBackground();
        //this.playMusicById(this.model.get('chapter_sound_id'));
      }

      if(this.isEditable){
        $('.entryList',this.el).sortable({
          start: this.onSortStart,
          stop: this.onSortStop
        });
      
        //$('.background_select',this.el)
        //    .find('option[value=' + this.model.get('background_image_id') + ']').prop('selected', true);

        //$('.bgm_select',this.el)
        //    .find('option[value=' + this.model.get('background_music_id') + ']').prop('selected', true);
      }

    }

    return this;
  },

  onSortStart: function(e,ui){
    console.log('onsort');
    this.sortItemIndex =  $(ui.item).parent().children().index(ui.item);
    console.log(this.sortItemIndex);
  },

  onSortStop: function(e,ui){
    console.log('onsortstop');
    var i =  $(ui.item).parent().children().index(ui.item);
    console.log(i);
    var entry = this.model.entries.at(this.sortItemIndex);
    var dest = this.model.entries.at(i);
    console.log(entry);
    this.model.entries.move_at(entry, i);
    this.model.entries.save();
    this.model.trigger('change');
    //this.model.fetch();
  },

  click: function(){
     console.log("chapter click");
  },

  onKeyPress: function (e){
    console.log("onkeypress");
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
/*
  initBackgroundList: function(){
    //  console.log('init list');
    var x = 3;
    for(var i=0; i < x; i++){
      var op = $('<option>').attr({ value: i }).text(i);
      $('.background_select',this.el).append(op);
      //console.log(i);
    }
  },
*/
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
      if (music_id !== null && music_id != 'null' && music_id) {
          //console.log(+music_id);
          window.musicPlayer.playURL(config.music_idtourl(music_id));
      } else {
          window.musicPlayer.stop();
      }
  }
});
