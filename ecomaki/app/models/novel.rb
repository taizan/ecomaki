class Novel < ActiveRecord::Base
  attr_accessible :author_id, :description, :parent_novel_id, :status, :title, :type

  has_many :chapter
  has_many :novel_tag
  has_many :tag, :through => :novel_tag
  has_many :novel_history
end
