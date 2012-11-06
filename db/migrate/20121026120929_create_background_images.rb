class CreateBackgroundImages < ActiveRecord::Migration
  def change
    create_table :background_images do |t|
      t.string  :name
      t.string  :description
      t.string  :author
      t.integer :width
      t.integer :height
      t.string  :content_type

      t.timestamps
    end
  end
end
