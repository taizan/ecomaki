class BackgroundMusicTagName < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_accessible :name
  
  has_many :background_music_tag
  has_many :background_music, :through => :background_music_tag
end
