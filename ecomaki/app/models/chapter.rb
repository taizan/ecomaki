class Chapter < ActiveRecord::Base
  attr_accessible :name, :no, :novel_id

  belongs_to :novel
  has_many :chapter_entry
  has_many :entry, :through => :chapter_entry
end
