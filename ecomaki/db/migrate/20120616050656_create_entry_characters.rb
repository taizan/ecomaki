class CreateEntryCharacters < ActiveRecord::Migration
  def change
    create_table :entry_characters do |t|
      t.integer :character_id
      t.integer :entry_id
      t.integer :x
      t.integer :y
      t.integer :width
      t.integer :height

      t.timestamps
    end
  end
end
