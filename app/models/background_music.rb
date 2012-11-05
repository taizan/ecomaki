class BackgroundMusic < ActiveRecord::Base
  attr_accessor :music
  attr_accessible :name, :music, :author, :description

  belongs_to :chapter

  before_save :read_music
  after_save :save_music
  
  def read_music
    self.content_type = @music.content_type.chomp
  end

  def save_music
    File.open(music_path, 'wb') do |file|
      file.write(@music.read)
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
