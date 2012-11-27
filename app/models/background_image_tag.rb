class BackgroundImageTag < ActiveRecord::Base
  attr_accessible :background_image_id, :background_image_tag_name_id

  belongs_to :background_image
  belongs_to :background_image_tag_name
end
