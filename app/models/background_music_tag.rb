class BackgroundMusicTag < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_accessible :background_music_id, :background_music_tag_name_id

  belongs_to :background_music
  belongs_to :background_music_tag_name
end
