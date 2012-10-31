class CreateEntryCharacters < ActiveRecord::Migration
  def change
    create_table :entry_characters do |t|
      t.integer :character_image_id
      t.integer :entry_id

      # Size, Position
      t.integer :top
      t.integer :left
      t.integer :width
      t.integer :height
      t.integer :angle
      t.integer :z_index

      t.integer :clip_top
      t.integer :clip_left
      t.integer :clip_bottom
      t.integer :clip_right

      t.string :option

      t.timestamps
    end
  end
end
