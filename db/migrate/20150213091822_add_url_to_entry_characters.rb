class AddUrlToEntryCharacters < ActiveRecord::Migration
  def change
    add_column :entry_characters, :url, :string
  end
end
