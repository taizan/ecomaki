class BackgroundImage < ActiveRecord::Base
  attr_accessor :image
  attr_accessible :name, :image, :description, :author

  validate :validate_image_file

  belongs_to :chapter

  before_save :read_image
  after_save :save_image

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

  def image
    image_path.binread rescue nil
  end

  private

  def image_path
    return Rails.root.join('data', 'images', 'background', self.id.to_s)
  end

  def validate_image_file
    max_file_size = 1000000
    allowed_file_types = ['image/jpeg', 'image/png', 'image/gif']

    errors.add(:image, "Uploaded file size is #{@image.size}. (max: #{max_file_Size})") if @image.size > max_file_size

    errors.add(:image, "Unsupported file type.") unless allowed_file_types.include?(@image.content_type.chomp)
  end
end
