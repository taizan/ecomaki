class ChangecolColumnname < ActiveRecord::Migration
  def up
    rename_column :entry_characters, :clip_top, :refrect
  end

  def down
  end
end
