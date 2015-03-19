class Comment < ActiveRecord::Base
  attr_accessible :novel_id,:name, :text

  belongs_to :novel
end
