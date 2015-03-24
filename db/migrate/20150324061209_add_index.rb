class AddIndex < ActiveRecord::Migration
  def up
    add_index :comments, :novel_id
    add_index :chapters, :novel_id
    add_index :entries, :chapter_id
    add_index :entry_balloons, :entry_id
    add_index :entry_characters, :entry_id
  end

  def down
  end
end
