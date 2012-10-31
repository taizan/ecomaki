class Character < ActiveRecord::Base
  attr_accessible :name, :description, :content_type, :author

  has_many :character_image
end
