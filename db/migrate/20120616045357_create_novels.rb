class CreateNovels < ActiveRecord::Migration
  def change
    create_table :novels do |t|

      # Author_id is not used for now.
      t.integer :author_id
      
      t.integer :parent_novel_id

      t.string :title
      t.string :description
      t.string :author
      t.string :status # private, publish
      t.string :password

      t.timestamps
    end
  end
end
