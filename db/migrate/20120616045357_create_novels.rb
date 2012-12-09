class CreateNovels < ActiveRecord::Migration
  def change
    create_table :novels do |t|

      # Author_id is not used for now.
      t.integer :author_id
      
      t.integer :parent_novel_id

      t.string :title
      t.string :description
      t.string :author_name
      t.string :status # private, publish
      t.string :password

      #for future work
      t.string :background_music
      t.string :option

      t.timestamps
    end
  end
end
