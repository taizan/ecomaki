class ChapterEntry < ActiveRecord::Base
  attr_accessible :chapter_id, :entry_id, :no

  has_one :chapter
  has_many :entry
end
