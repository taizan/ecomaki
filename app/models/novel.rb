class Novel < ActiveRecord::Base
  attr_accessible :author_id, :description, :title, :status, :author_name, :parent_novel_id, :password
  attr_accessible :character_ids
  serialize :character_ids
#  validates :title, :presence => true

  belongs_to :author

  has_many :chapter
  has_many :novel_tag
  has_many :tag, :through => :novel_tag
  has_many :novel_history

  has_many :comment

  amoeba do
    include_field [:chapter]
  end
end
