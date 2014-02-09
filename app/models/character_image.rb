class CharacterImage < ActiveRecord::Base
  attr_accessor :image
  attr_accessible :character_id, :author, :description, :image

  belongs_to :character
  has_many :entry_character

  #before_save :read_image
  #after_save :save_image

  def read_image
    # Read content_type
    self.content_type = @image.content_type.chomp

    # Read image size by RMagick
    require 'rubygems'
    require 'RMagick'
    img = Magick::Image::read(@image.path).first
    self.width = img.columns
    self.height = img.rows
  end

  def save_image
    File.open(image_path, 'wb') do |file|
      file.write(@image.read)
    end
  end

  def set_png_type
    self.content_type = "image/png"

  end

  def save_image_data
  
    File.open(image_path, 'wb') do |file|
      file.write(@image)
    end

    require 'rubygems'
    require 'RMagick'
    img = Magick::Image::read(image_path).first
    self.width = img.columns
    self.height = img.rows
  end

  def image
    image_path.binread rescue nil
  end

  private

  def image_path
    return Rails.root.join('data', 'images', 'characters', self.id.to_s)
  end
end
