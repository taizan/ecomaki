class AddBackgroundUrlToChapters < ActiveRecord::Migration
  def change
    add_column :chapters, :background_url, :string
  end
end
