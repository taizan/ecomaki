class Entry < ActiveRecord::Base
  attr_accessible :chapter_id, :width, :height, :order_number

  belongs_to :chapter

  has_many :entry_character
  has_many :entry_balloon
end
