class Chapter < ActiveRecord::Base
  attr_accessible :name, :no, :novel_id

  has_one :novel
  has_many :chapter_entry
end
