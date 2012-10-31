class CharacterImage < ActiveRecord::Base
  attr_accessor :image
  attr_accessible :content_type, :character_id
  attr_accessible :width, :height

  belongs_to :character
  has_many :entry_character

  after_save :save_image

  def save_image
    File.open(image_path, 'wb') do |file|
      file.write(@image)
    end
  end

  def image
    image_path.binread rescue nil
  end

  private

  def image_path
    return Rails.root.join('data', 'images', 'characters', self.id.to_s)
  end
end
