class Character < ActiveRecord::Base
  attr_accessible :name, :description, :content_type
  attr_accessible :author, :width, :height

  has_one :entry_character
end
