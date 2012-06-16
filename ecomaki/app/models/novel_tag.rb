class NovelTag < ActiveRecord::Base
  attr_accessible :novel_id, :tag_id

  belongs_to :tag
  belongs_to :novel
end
