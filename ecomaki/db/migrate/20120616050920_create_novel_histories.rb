class CreateNovelHistories < ActiveRecord::Migration
  def change
    create_table :novel_histories do |t|
      t.integer :novel_id
      t.integer :author_id
      t.string :type
      t.integer :val0
      t.integer :val1

      t.timestamps
    end
  end
end
