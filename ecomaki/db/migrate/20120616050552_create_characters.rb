class CreateCharacters < ActiveRecord::Migration
  def change
    create_table :characters do |t|
      t.string :name
      t.string :content_type
      t.integer :width
      t.integer :height

      t.timestamps
    end
  end
end
