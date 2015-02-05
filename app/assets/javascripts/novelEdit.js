//= require underscore
//= require backbone
//= require jquery.form
//= require jquery.balloon.min
//= require wColorPicker.1.2.min
//= require html2canvas.min
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
//= require ./tools/tutorial



$(function() {

  // function define 
  //
  // initializeView
  //
  // initializeTool
  //
  //
  
  window.onbeforeunload = function (e) {
  //window.onunload = function (e) {
    var message = "再編集するにはこのページのURLを保存してください";
    e = e || window.event;
 
    // For IE and Firefox
    if (e) {
      e.returnValue = message;
    } 
    // For Safari
    return message;
  };


  var novelEdit = {
 
  initializeView : function(id,pass,isEditable){
    var makeView = function(){
      _novelView = new NovelView({model: _novel , isEditable: isEditable  });
      _novelView.appendTo($('#content'));
      var tutorialBalloon = new TutorialBalloon();
      tutorialBalloon.next();
    }

    _novel = new Novel({id: id,password: pass});
   
    _novel.fetch({
      success: function(){
        // check status here 
        // viewに実装したほうがいいか？　その場合view初期化時の処理と衝突
        if(_novel.get('status') == 'initial'){
          //テンプレートから初期化する場合には先に読み込む
          EntryTemplate.prototype.initialize(function(){
            //テンプレートの選択はテンプレートの初期化の後とする
			      selectTemplate(_novel,makeView );
          });
          //>>>> make templates
          _novel.save({'status': 'draft'});
        }
        else{
          EntryTemplate.prototype.initialize();
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

    var setPreview = function( isPreView ){
        //change button
			  $('#preview_button img')
          .attr('src', '/assets/novel/' + ( !isPreView ? 'preview.png' : 'edit.png'));
			  $('#preview_button p')
          .text( !isPreView ? 'プレビュー' : '編集');
        
        //setup view
        $('#content').empty();
        _novelView.destroyView();
        _novelView = new NovelView({model: _novel , isEditable: !isPreView });
        _novelView.appendTo($('#content'));
        _novelView.onScrollEnd()
        if( !isPreView) {
          $('#toolbox').show();
          $('.editer_item').show();
        }else{
          $('#toolbox').hide();
          $('.tutorial_dialog').hide();
          $('.editer_item').hide();
          $('.tutorial_balloon').hide();
        }
    }

    // Preveiw Button Click
    $('#preview_button').click(function(){
        isEditable = isEditable ? false : true;
        
        setPreview(isEditable);

      });
    
    // Publish button Click
    $('#publish_button').click(function(){ 
        isEditable = false;
        setPreview(true);
        html2canvas( $(".novel")[0] , 
            { 
              onrendered: function(canvas) {
                var imgData = canvas.toDataURL().replace(/^.*,/, '');
                //$('<img src="'+"data:image/png;base64,"+imgData+'">').appendTo("body");
                var id = _novel.get("id");
                var text = _novel.get("title") + " #ecomaki " + window.location.origin+"/novel/"+id;
                $.ajax( {
                    type: 'POST',
                    url: '/tweet',
                    data: 'id='+id+'&text='+text+'&imageURL='+imgData
                  });
             }
          });

        var onSuccess = function(){
          alert("作品を公開しました！ソーシャルメディアなどで宣伝しましょう！"); 
          document.location = '/novels/'+id ;
        }
        _novel.save('status','publish', { success: onSuccess } ); 
      });

      novelEdit.setTutorial();
  },

  //チュートリアルセットアップ
  setTutorial : function(){

    var tutorial = $($('#tutorial_template').html())
      .appendTo('body');

    $("#help_tab_button").click(function(){
    
      if( $("#help_pane").length == 0 ){
        $($('#help_template').html())
          .appendTo('body')
        $.ajax({
          type: 'GET',
          url: '/tutorial/new_index.html',
          dataType: 'html',
          success: function (data) {
                console.log($(".content",data));
                $(".content",data).appendTo('.help_content');
                $('#help_template')
                  .height( window.innerHeight );
                $(".help_cancel_button").click( function(){
                  $("#help_pane").hide();
                });
              },
          });
      }else{
         $("#help_pane").show();
      }
      $("#paint_tab_button").click();
    });

/*    var dialog_top = 40;
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
*/
  },

  onStaticBodyClick: function(ev){
    //console.log(ev.target);
    TextEditMenu.prototype.onBlur(ev);
    TextEdit.prototype.onBlur(ev);
    Picker.prototype.onBlur(ev);

    if( !$(ev.target).is('#help_pane') ){
      $("#help_pane").hide();
    }

  },


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

  $("#output_html").text(
    '<script src="'+location.origin+'/assets/exShow.js"></script>'
    +'<div class="novel_container" id="'+id+'" root="'+ location.origin +'" ><div id="content"></div></div>')

});
