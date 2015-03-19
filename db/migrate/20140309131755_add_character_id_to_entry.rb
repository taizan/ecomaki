class AddCharacterIdToEntry < ActiveRecord::Migration
  def up
    rename_column :entry_characters, :clip_bottom, :character_id
    add_column :entries, :character_ids, :text
    add_column :novels,  :character_ids, :text
  end
end
