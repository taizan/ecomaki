class Entry < ActiveRecord::Base
  attr_accessible :author, :height, :novel_id, :parent_entry_id, :type, :width
end
