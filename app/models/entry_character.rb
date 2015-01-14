class EntryCharacter < ActiveRecord::Base
  attr_accessible :entry_id, :height, :width, :top, :left, :rotation, :z_index
  attr_accessible :character_image_id, :character_id
  attr_accessible :angle, :refrect
  attr_accessible :clip_left, :clip_right
  attr_accessible :option

  belongs_to :entry
  belongs_to :character_image
end
