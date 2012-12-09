EntryTemplate = function(){};

EntryTemplate.prototype = 
{

  getTemplate : function(i){
    if ( EntryTemplate.prototype.templateList[i]) {
      var tempList = EntryTemplate.prototype.templateList[i];
      if ( tempList.length > 0 ) {
        var i = Math.floor((Math.random() *  tempList.length ));
        return tempList[i];
      } 
    }
    return null;
  },
 
  templateList:
  [
    // on person temp
    [
      {"canvas_index":1,"height":320,"margin_bottom":null,"margin_left":null,"margin_right":null,"margin_top":null,"option":null,"updated_at":"2012-12-09T21:09:58+09:00","width":640,"canvas":"","entry_balloon":[{"background_color":null,"border_color":null,"border_radius":null,"border_style":null,"border_width":null,"content":"やっほー","entry_balloon_background_id":null,"font_color":null,"font_family":null,"font_size":null,"font_style":null,"height":50,"left":500,"option":null,"top":50,"width":100,"z_index":1},{"background_color":null,"border_color":null,"border_radius":null,"border_style":null,"border_width":null,"content":"やっほー","entry_balloon_background_id":null,"font_color":null,"font_family":null,"font_size":null,"font_style":null,"height":50,"left":0,"option":null,"top":0,"width":100,"z_index":1}],"entry_character":[{"angle":null,"character_image_id":4,"clip_bottom":null,"clip_left":null,"clip_right":null,"clip_top":null,"height":259,"left":333,"option":null,"top":43,"width":171,"z_index":4},{"angle":null,"character_image_id":2,"clip_bottom":null,"clip_left":null,"clip_right":null,"clip_top":null,"height":237,"left":137,"option":null,"top":72,"width":171,"z_index":5}]}  
    ],

    // two person temp
    [
      {"canvas_index":1,"height":320,"margin_bottom":null,"margin_left":null,"margin_right":null,"margin_top":null,"option":null,"updated_at":"2012-12-09T21:09:58+09:00","width":640,"canvas":"","entry_balloon":[{"background_color":null,"border_color":null,"border_radius":null,"border_style":null,"border_width":null,"content":"やっほー","entry_balloon_background_id":null,"font_color":null,"font_family":null,"font_size":null,"font_style":null,"height":50,"left":500,"option":null,"top":50,"width":100,"z_index":1},{"background_color":null,"border_color":null,"border_radius":null,"border_style":null,"border_width":null,"content":"やっほー","entry_balloon_background_id":null,"font_color":null,"font_family":null,"font_size":null,"font_style":null,"height":50,"left":0,"option":null,"top":0,"width":100,"z_index":1}],"entry_character":[{"angle":null,"character_image_id":4,"clip_bottom":null,"clip_left":null,"clip_right":null,"clip_top":null,"height":259,"left":333,"option":null,"top":43,"width":171,"z_index":4},{"angle":null,"character_image_id":2,"clip_bottom":null,"clip_left":null,"clip_right":null,"clip_top":null,"height":237,"left":137,"option":null,"top":72,"width":171,"z_index":5}]}
    ],

    // description temp
    [
      {"canvas_index":1,"height":320,"margin_bottom":null,"margin_left":null,"margin_right":null,"margin_top":null,"option":null,"updated_at":"2012-12-09T21:09:58+09:00","width":640,"canvas":"","entry_balloon":[{"background_color":null,"border_color":null,"border_radius":null,"border_style":null,"border_width":null,"content":"やっほー","entry_balloon_background_id":null,"font_color":null,"font_family":null,"font_size":null,"font_style":null,"height":50,"left":500,"option":null,"top":50,"width":100,"z_index":1},{"background_color":null,"border_color":null,"border_radius":null,"border_style":null,"border_width":null,"content":"やっほー","entry_balloon_background_id":null,"font_color":null,"font_family":null,"font_size":null,"font_style":null,"height":50,"left":0,"option":null,"top":0,"width":100,"z_index":1}],"entry_character":[{"angle":null,"character_image_id":4,"clip_bottom":null,"clip_left":null,"clip_right":null,"clip_top":null,"height":259,"left":333,"option":null,"top":43,"width":171,"z_index":4},{"angle":null,"character_image_id":2,"clip_bottom":null,"clip_left":null,"clip_right":null,"clip_top":null,"height":237,"left":137,"option":null,"top":72,"width":171,"z_index":5}]} 
    ]
  ],
}
