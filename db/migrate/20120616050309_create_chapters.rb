class CreateChapters < ActiveRecord::Migration
  def change
    create_table :chapters do |t|
      t.integer :novel_id
      t.integer :background_image_id
      t.integer :background_music_id
      
      t.string :title
      t.string :description
      t.integer :order_number

      # for future
      t.string :option
      t.integer :layout_type

      t.timestamps
    end
  end
end
