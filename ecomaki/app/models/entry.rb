class Entry < ActiveRecord::Base
  attr_accessible :author_id, :height, :chapter_id, :width, :order_number

  belongs_to :chapter

  belongs_to :author

  has_many :entry_character
  has_many :entry_balloon
end
