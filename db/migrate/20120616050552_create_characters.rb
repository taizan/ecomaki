class CreateCharacters < ActiveRecord::Migration
  def change
    create_table :characters do |t|
      t.string :name
      t.string :description

      # png or jpeg of bmp?
      t.string :content_type

      t.string :author

      t.timestamps
    end
  end
end
