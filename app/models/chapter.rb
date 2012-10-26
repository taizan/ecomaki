class Chapter < ActiveRecord::Base
  attr_accessible :title, :description, :order_number, :novel_id, :background_image_id, :background_music_id

  belongs_to :novel
  has_many :entry
  has_one :background_music
end
