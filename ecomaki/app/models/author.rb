class Author < ActiveRecord::Base
  attr_accessible :name, :password

  has_many :novel
  has_many :novel_history
  has_many :entry
end
