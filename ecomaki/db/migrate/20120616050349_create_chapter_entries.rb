class CreateChapterEntries < ActiveRecord::Migration
  def change
    create_table :chapter_entries do |t|
      t.integer :chapter_id
      t.integer :entry_id
      t.integer :no

      t.timestamps
    end
  end
end
