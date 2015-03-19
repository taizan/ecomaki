class AddBackgroundUrlToEntries < ActiveRecord::Migration
  def change
    add_column :entries, :background_url, :string
  end
end
