class Tag < ActiveRecord::Base
  attr_accessible :name

  has_many :novel_tag
  has_many :novel, :through => :novel_tag
end
