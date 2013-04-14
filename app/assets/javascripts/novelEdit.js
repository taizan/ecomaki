//= require underscore
//= require backbone
//= require jquery.form
//= require wColorPicker.1.2.min
//
//= require ./models
//= require ./views/ecomakiView
//= require ./views/entryItems
//= require ./views/entryView
//= require ./views/entryTemplate
//= require ./views/chapterView
//= require ./views/novelView
//= require ./views/musicPlayer
//= require ./tools/textEdit
//= require ./tools/toolMenu
//= require ./tools/textEditTool
//= require ./tools/picker
//= require ./tools/effecter
//= require ./tools/console
//= require ./tools/wPaint



$(function() {

  // function define 
  //
  // initializeView
  //
  // initializeTool
  //
  //
  var novelEdit = {
 
  initializeView : function(id,pass,isEditable){

    var makeView = function(){
      _novelView = new NovelView({model: _novel , isEditable: isEditable  });
      _novelView.appendTo($('#content'));
    }

    _novel = new Novel({id: id,password: pass});
    _novel.fetch({
    success: function(){
      // check status here 
      // viewに実装したほうがいいか？　その場合view初期化時の処理と衝突
      if(_novel.get('status') == 'initial'){
			  selectTemplate(_novel,makeView );
      //>>>> make templates
        _novel.save({'status': 'draft'});
       }
       else{
        makeView();
      }
    }
  });

    $('#toolbox').hide();
    $('#console').hide();  
    $('#side_menu').hide();

    $(document).tooltip();
    $('#static_body').bind('mousedown',novelEdit.onStaticBodyClick);

  },

  initializeTool : function(isEditable,id){
    $('#toolbox').show();

    Picker.prototype.initialize();

    // Prever Button Click
    $('#preview_button').click(function(){
        isEditable = isEditable ? false : true;
			  $('#preview_button img').attr('src', '/assets/novel/' + (isEditable ? 'preview.png' : 'edit.png'));
			  $('#preview_button p').text(isEditable ? 'Preview' : 'Edit');
        $('#content').empty();
        _novelView.destroyView();
        _novelView = new NovelView({model: _novel , isEditable: isEditable });
        _novelView.appendTo($('#content'));
        if(isEditable) {
          $('#toolbox').show();
        }else{
          $('#toolbox').hide();
          $('.tutorial_dialog').hide();
        }
      });
    
    // Publish button Click
    $('#publish_button').click(function(){ 
        _novel.save('status','publish',
            { 
              success: function(){
                  alert("作品を公開しました！ソーシャルメディアなどで宣伝しましょう！"); 
                  document.location = '/novels/'+id ;
                }
            }
          ); 
      });

      //novelEdit.setTutorial();
  },

  //チュートリアルセットアップ
  setTutorial : function(){
    var dialog_top = 40;
    if( config.getScreenSize().x < 1066) dialog_top = 70;
    console.log( config.getScreenSize().x);
    var tutorial = $($('#tutorial_template').html())
      .appendTo('body')
      .dialog()
      .parent().css({ 'top': dialog_top, 'left': 0 , 'position': 'fixed' , 'z-index': 99999}).addClass('tutorial_dialog') ;
  
    $('.ui-dialog-titlebar-close',tutorial).click(function(){ $('.tutorial_dialog').hide(); });

    $('#tutorial_button').click(function(){ 
      //tutorial.dialog('enable');
        $('.tutorial_dialog')
          .show()
          .css({ 'top': dialog_top, 'left': 0 , 'position': 'fixed' , 'z-index': 99999});
      });

    var tutorial_progless = 0;

    // チュートリアルの進む
    //
    $('#tutorial_next_button').click( function() {
      tutorial_progless++;
      var next = $('#tutorial_template_' + tutorial_progless ).html();
      if( next) {
        $('#tutorial_content').html( next )
        console.log($('#tutorial_template_' + tutorial_progless ).html());
        $('#tutorial_back_button').show();
      }
      else{
        $('#tutorial_content').html( 'End' );
        $('#tutorial_next_button').hide();
      }
    });

    // チュートリアルの戻る
    $('#tutorial_back_button').click( function() {
      tutorial_progless--;
      var prev = $('#tutorial_template_' + tutorial_progless ).html();
      if( prev) {
        $('#tutorial_content').html( prev )
        //console.log($('#tutorial_template_' + tutorial_progless ).html());
        $('#tutorial_next_button').show();
      }
      else{
        $('#tutorial_content').html( $('#tutorial_template_0' ).html() );
        $('#tutorial_back_button').hide(); 
      }
    });
    //console.log($('#tutorial_template').html());
  },

  onStaticBodyClick: function(ev){
    //console.log(ev.target);
    TextEditMenu.prototype.onBlur(ev);
    TextEdit.prototype.onBlur(ev);
    Picker.prototype.onBlur(ev);
  },

  // dont work well
  setOnUnload: function(){
    window.onbeforeunload = function () {
        if (document.title.indexOf("*") != -1) {
                    return ("You have unsaved changes...");
        }
    }
    window.onunload=function() {
      alert();
      return confirm('Are you sure you want to leave the current page?');  
    }

    $(window).unload( function () { alert("Bye now!"); } );
  }

  };


  // initialize of page

  var isEditable = true;

  // get id from page DOM
  var id = $('.novel_container').attr('id');
  
  //get pass from url
  var urls = location.href.split('/');
  var pass = urls.length > 5 ? urls[5] : null;  
  //console.log(pass);

  // initialize view and tool 
  novelEdit.initializeView(id,pass,isEditable);
  novelEdit.initializeTool(isEditable,id);


});
