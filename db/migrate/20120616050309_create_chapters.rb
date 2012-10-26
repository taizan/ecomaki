class CreateChapters < ActiveRecord::Migration
  def change
    create_table :chapters do |t|
      t.integer :novel_id
      t.integer :background_image_id
      t.integer :backfounrd_music_id
      
      t.string :title
      t.string :description
      t.integer :order_number

      t.timestamps
    end
  end
end
