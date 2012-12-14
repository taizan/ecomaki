class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.integer :chapter_id
      t.integer :width
      t.integer :height
      t.integer :order_number
      t.integer :canvas_index

      # for future
      t.integer :background_image_id
      t.integer :margin_top
      t.integer :margin_left
      t.integer :margin_bottom
      t.integer :margin_right
      t.string  :option
      
      t.timestamps
    end
  end
end
