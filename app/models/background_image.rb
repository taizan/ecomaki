class BackgroundImage < ActiveRecord::Base
  attr_accessor :image
  attr_accessible :name, :content_type

  belongs_to :chapter

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
    return Rails.root.join('data', 'images', 'background', @id)
  end
end
