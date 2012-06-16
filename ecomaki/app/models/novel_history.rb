class NovelHistory < ActiveRecord::Base
  attr_accessible :author_id, :novel_id, :type, :val0, :val1
end
