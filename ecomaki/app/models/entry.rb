class Entry < ActiveRecord::Base
  attr_accessible :author_id, :height, :novel_id, :parent_entry_id, :create_type, :width


  belongs_to :chapter_entry
  has_one :chapter, :through => :chapter_entry
  belongs_to :author

  has_many :entry_character
  has_many :entry_balloon
end
