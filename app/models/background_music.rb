class BackgroundMusic < ActiveRecord::Base
  attr_accessor :music
  attr_accessible :name, :content_type, :music, :author, :description

  belongs_to :chapter

  after_save :save_music
  
  def save_music
    File.open(music_path, 'wb') do |file|
      file.write(@music)
    end
  end

  def music
    music_path.binread rescue nil
  end

  private

  def music_path
    return Rails.root.join('data', 'musics', 'background', self.id.to_s)
  end
end
