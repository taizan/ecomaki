class BackgroundImageTagName < ActiveRecord::Base
  attr_accessible :name

  has_many :background_image_tag
  has_many :background_image, :through => :background_image_tag
end
