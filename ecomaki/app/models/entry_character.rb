class EntryCharacter < ActiveRecord::Base
  attr_accessible :character_id, :entry_id, :height, :width, :x, :y

  has_one :entry
end
