ChapterView = Backbone.View.extend({
  //el : '#content',
  className : 'chapter' ,
  isLoaded: false,
  isDisplayed: false,

  initialize: function(args){

    this.parentView = args.parentView;
    this.isEditable = args.isEditable;

  _.bindAll(this,
              "render",
              "addEntry",
              "addAll",
              "addOne",
              "onLoad",
              "onScroll",
              "displayed",
              "onChange",
              "onSortStart",
              "onSortStop",
              "addChapter",
              "removeChapter",
              "saveTitle",
              "saveDescription",
              "backgroundSelect",
              "bgmSelect");
    this.model.bind("change", this.render);
    this.model.entries.bind('add', this.addOne);
    this.model.entries.bind('refresh', this.addAll);
    this.model.entries.bind('change', this.onChange);
  },

  events: {
    "keypress #inputform" : "onKeyPress",
    "click .add_chapter" : "addChapter",
    "click .add_entry" : "addEntry",
    "click .remove_chapter" : "removeChapter",
  },

  onLoad: function(){
    this.isLoaded = true;
    var template = _.template( $("#chapter_template").html(),this.model.attributes);
    //console.log(template);
    $(template).appendTo(this.el);

    var _self = this;

    if(this.isEditable){
      $('.title',this.el).dblclick( function(){ editableTextarea(this,_self.saveTitle); });
      $('.description',this.el).dblclick( function(){ editableTextarea(this,_self.saveDescription); });
    
      $('.background_select',this.el).change( function(){ _self.backgroundSelect( $(this).val() );} );
      this.initBackgroundList();
      $('.bgm_select',this.el).change( function(){ _self.bgmSelect( $(this).val() );} );
    }else{
      $(".editer_item",this.el).hide();
    }

    $(window).scroll(this.onScroll);

    this.render();
    return this;
  },

  displayed: function(){
    //console.log('isDisplayed');
    //console.log(this);
    $('#background')[0].src = Config.prototype.background_idtourl(this.model.get('chapter_background_id'));
    this.playMusicById(this.model.get('chapter_sound_id')); 
    return this;
  },

  onScroll: function(){ 
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    var window_center_height = Config.prototype.getScreenSize().my;
    //console.log(this.isDisplayed);
    if( $(this.el).offset().top - window_center_height < scroll
        && scroll < $(this.el).offset().top - window_center_height + $(this.el).height() )
    {
      if(this.isDisplayed == false){
        this.isDisplayed = true;
        this.displayed();
      }
    } else if(this.isDisplayed) {
      this.isDisplayed = false;
    }
    return this;
  },

  addOne: function (item,t,options) {
    //console.log(item);
    var view = new EntryView({model: item , parentView: this ,isEditable: this.isEditable });
    $('.entryList' ,this.el).insertAt(options.index,view.el);
    view.onLoad();
  },

  addAll: function () {
    //_(this.model.entries.models).each(console.log) ;
    $('.entryList' ,this.el).empty();
    //console.log(this.model.entries.models);
    _(this.model.entries.models).each(this.addOne);
  },

  onChange: function(){
    //console.log("onchange");
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
    this.parentView.model.destroy_chapter(this.model);
    //this.parentView.model.fetch();
    this.parentView.model.save();
  },

  render: function(){
    if(this.isLoaded){
      console.log("chapter render");

      $('.title .text',this.el).html(this.model.get('title'));
      $('.description .text',this.el).html(this.model.get('description'));

      this.addAll();

      if(this.isDisplayed) { 
        $('#background')[0].src = Config.prototype.background_idtourl(this.model.get('chapter_background_id'));
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

    console.log(entry);
    this.model.entries.remove(entry);
    this.model.entries.add(entry,{at:i});
    this.model.save();
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

  saveTitle: function(txt){
    this.model.set('title',txt);
    this.model.save();
  },

  saveDescription: function(txt){
    this.model.set('description',txt);
    this.model.save();
  },

  backgroundSelect: function(val){
    console.log('change bg');
    this.model.set('chapter_background_id',val);
    this.model.save();
    $('#background')[0].src = Config.prototype.background_idtourl(val);
  },

  initBackgroundList: function(){
    //  console.log('init list');
    var x = 3;
    for(var i=0; i < x; i++){
      var op = $('<option>').attr({ value: i }).text(i);
      $('.background_select',this.el).append(op);
      console.log(i);
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
          window.musicPlayer.playURL(Config.prototype.music_id_to_url(music_id));
      } else {
          window.musicPlayer.stop();
      }
  }
});
