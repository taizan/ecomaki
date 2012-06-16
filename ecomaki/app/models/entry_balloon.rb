class EntryBalloon < ActiveRecord::Base
  attr_accessible :entry_id, :content, :height, :width, :x, :y

  has_one :entry
end
