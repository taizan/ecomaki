class Novel < ActiveRecord::Base
  attr_accessible :author_id, :description, :parent_novel_id, :status, :title, :type
end
