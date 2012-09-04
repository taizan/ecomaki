class Novel < ActiveRecord::Base
  attr_accessible :author_id, :description, :title, :status

  belongs_to :author
  has_many :chapter
  has_many :novel_tag
  has_many :tag, :through => :novel_tag
  has_many :novel_history
end
