class CreateNovelTags < ActiveRecord::Migration
  def change
    create_table :novel_tags do |t|
      t.integer :novel_id
      t.integer :tag_id

      t.timestamps
    end
  end
end
