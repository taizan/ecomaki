class ChapterEntry < ActiveRecord::Base
  attr_accessible :chapter_id, :entry_id, :no

  belongs_to :chapter
  belongs_to :entry
end
