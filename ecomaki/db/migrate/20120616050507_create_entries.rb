class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.integer :chapter_id
      t.integer :width
      t.integer :height
      t.integer :order_number
      t.integer :canvas_index
      t.timestamps
    end
  end
end
