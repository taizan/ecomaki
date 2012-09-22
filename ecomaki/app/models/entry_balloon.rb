class EntryBalloon < ActiveRecord::Base
  attr_accessible :entry_id, :content, :top, :left, :width, :height, :z_index
  attr_accessible :font_family, :font_style, :font_color, :font_size
  attr_accessible :boarder_style, :boarder_width, :boarder_color
  attr_accessible :entry_balloon_background_id, :option

  belongs_to :entry
end
