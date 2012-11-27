class Character < ActiveRecord::Base
  attr_accessible :name, :description, :author

  has_many :character_image
end
