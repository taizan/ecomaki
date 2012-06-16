class Entry < ActiveRecord::Base
  attr_accessible :author, :height, :novel_id, :parent_entry_id, :type, :width

  has_one :chapter_entry
  has_one :author
  has_many :entry_character
  has_many :entry_balloon
end
