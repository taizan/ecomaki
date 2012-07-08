class Character < ActiveRecord::Base
  attr_accessible :height, :name, :width, :content_type

  has_one :entry_character
end
