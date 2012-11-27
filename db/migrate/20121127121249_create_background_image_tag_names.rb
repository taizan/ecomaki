class CreateBackgroundImageTagNames < ActiveRecord::Migration
  def change
    create_table :background_image_tag_names do |t|
      t.string :name
      t.timestamps
    end
  end
end
