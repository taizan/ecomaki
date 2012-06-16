class CreateNovels < ActiveRecord::Migration
  def change
    create_table :novels do |t|
      t.integer :parent_novel_id
      t.integer :author_id
      t.string :title
      t.string :description
      t.string :status
      t.string :type

      t.timestamps
    end
  end
end
