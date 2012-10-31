class CreateCharacterImages < ActiveRecord::Migration
  def change
    create_table :character_images do |t|
      t.integer :character_id
      t.string :content_type
      t.integer :width
      t.integer :height
      t.timestamps
    end
  end
end
