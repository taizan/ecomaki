class BackgroundImage < ActiveRecord::Base
  # attr_accessible :title, :body

  belongs_to :chapter
end
