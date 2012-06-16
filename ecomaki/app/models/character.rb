class Character < ActiveRecord::Base
  attr_accessible :height, :name, :width

  has_one :entry_character
end
