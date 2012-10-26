class BackgroundMusic < ActiveRecord::Base
  attr_accessible :name

  belongs_to :chapter
end
