ChapterView = ecomakiView.extend({
  //el : '#content',
  className : 'chapter' ,
  tmplId: "#chapter_template",
  childViewType: EntryView,
  elementList: ".entryList",


  onInit: function(args){

  _.bindAll(this,
              "addEntry",
              "onLoad",
              "onSortStart",
              "onSortStop",
              "addChapter",
              "removeChapter",
              "backgroundSelect",
              "bgmSelect");
    this.model.entries.bind('add', this.addOne);
    this.model.entries.bind('refresh', this.addAll);
    this.model.entries.bind('change', this.onChange);

    this.childModels = this.model.entries.models;
  },

  events: {
    "keypress #inputform" : "onKeyPress",
    "click .add_chapter" : "addChapter",
    "click .add_entry" : "addEntry",
    "click .remove_chapter" : "removeChapter",
  },

  onLoad: function(){
    var _self = this;

    this.addAll();

    if(this.isEditable){
      $('.title',this.el).click( function(){ editableTextarea(this,_self.saveTitle); });
      $('.description',this.el).click( function(){ editableTextarea(this,_self.saveDescription); });
    
      $('.background_select',this.el).change( function(){ _self.backgroundSelect( $(this).val() );} );
      this.initBackgroundList();
      $('.bgm_select',this.el).change( function(){ _self.bgmSelect( $(this).val() );} );
    }else{
      $(".editer_item",this.el).hide();
    }

    this.render();
    return this;
  },

  onAddChild: function(view){
    view.load();
  },

  onDisplay: function(){
    //console.log('isDisplayed');
    //console.log(this);
    $('#background')[0].src = config.background_idtourl(this.model.get('chapter_background_id'));
    this.playMusicById(this.model.get('chapter_sound_id')); 
    return this;
  },



  addEntry: function(e){
    console.log("addEntry");
    console.log(this);
    //this.model.
    this.model.create_entry(
      {
        height: 200,
        width:  500,
        canvas_index: 1,
      }
    );
  },

  addChapter: function(e){
    console.log("addChapter");
    console.log(this.parentView);
    this.parentView.model.create_chapter();
  },

  removeChapter: function(e){
    $(this.el).remove();
    this.model.destroy();
  },

  render: function(){
    if(this.isLoaded){
      console.log("chapter render");

      $('.title .text',this.el).html(this.model.get('title'));
      $('.description .text',this.el).html(this.model.get('description'));

      if(this.isDisplayed) { 
        $('#background')[0].src = config.background_idtourl(this.model.get('chapter_background_id'));
        //this.playMusicById(this.model.get('chapter_sound_id'));
      }

      if(this.isEditable){
        $('.entryList',this.el).sortable({
          start: this.onSortStart,
          stop: this.onSortStop
        });
      
        $('.background_select',this.el)
            .find('option[value=' + this.model.get('chapter_background_id') + ']').prop('selected', true);

        $('.bgm_select',this.el)
            .find('option[value=' + this.model.get('chapter_sound_id') + ']').prop('selected', true);
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


  backgroundSelect: function(val){
    console.log('change bg');
    this.model.set('chapter_background_id',val);
    this.model.save();
    $('#background')[0].src = config.background_idtourl(val);
  },

  initBackgroundList: function(){
    //  console.log('init list');
    var x = 3;
    for(var i=0; i < x; i++){
      var op = $('<option>').attr({ value: i }).text(i);
      $('.background_select',this.el).append(op);
      //console.log(i);
    }
  },

  bgmSelect: function(bgm_id){
    this.model.set('chapter_sound_id',bgm_id);
    this.model.save();
    this.playMusicById(bgm_id);
  },

  playMusicById: function(music_id) {
      //console.log(music_id);
      if (music_id != null) {
          //console.log(+music_id);
          window.musicPlayer.playURL(config.music_id_to_url(music_id));
      } else {
          window.musicPlayer.stop();
      }
  }
});
