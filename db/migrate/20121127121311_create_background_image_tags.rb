class CreateBackgroundImageTags < ActiveRecord::Migration
  def change
    create_table :background_image_tags do |t|
      t.integer :background_image_id
      t.integer :background_image_tag_name_id

      t.timestamps
    end
  end
end
