class EntryBalloon < ActiveRecord::Base
  attr_accessible :entry_id, :content, :top, :left, :width, :height, :z_index, :rotation
  attr_accessible :font_family, :font_style, :font_color, :font_size
  attr_accessible :border_style, :border_width, :border_color, :border_radius
  attr_accessible :background_color, :entry_balloon_background_id, :option

  belongs_to :entry
end
