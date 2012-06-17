class EntryBalloon < ActiveRecord::Base
  attr_accessible :entry_id, :content, :height, :width, :x, :y

  belongs_to :entry
end
