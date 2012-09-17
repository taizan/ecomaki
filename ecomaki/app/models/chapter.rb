class Chapter < ActiveRecord::Base
  attr_accessible :title, :description, :order_number, :novel_id, :chapter_background_id, :chapter_sound_id

  belongs_to :novel
  has_many :entry
end
