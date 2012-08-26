class CreateNovels < ActiveRecord::Migration
  def change
    create_table :novels do |t|
      t.integer :author_id
      t.string :title
      t.string :description
      t.string :status # private, publish

      t.timestamps
    end
  end
end
