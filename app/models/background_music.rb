class BackgroundMusic < ActiveRecord::Base
  attr_accessor :music
  attr_accessible :name, :music, :author, :description

  validates :music, :name, :presence => true
  validate :validate_music_file
  
  belongs_to :chapter

  has_many :background_music_tag
  has_many :background_music_tag_name, :through => :background_music_tag

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

  def validate_music_file
    max_file_size = 4000000
    errors.add(:music, "Your file size is #{@music.size}. (max: #{max_file_size})") if @music.size > max_file_size
    errors.add(:music, "Unsupported file type.") unless ["audio/mp3"].include?(@music.content_type.chomp)
  end
end
