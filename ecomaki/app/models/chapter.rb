class Chapter < ActiveRecord::Base
  attr_accessible :name, :order_number, :novel_id

  belongs_to :novel
  has_many :entry
end
