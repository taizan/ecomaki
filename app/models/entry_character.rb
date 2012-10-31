class EntryCharacter < ActiveRecord::Base
  attr_accessible :character_image_id, :entry_id, :height, :width, :top, :left, :angle, :z_index
  attr_accessible :clip_top, :clip_left, :clip_bottom, :clip_right
  attr_accessible :option

  belongs_to :entry
  belongs_to :character_image
end
