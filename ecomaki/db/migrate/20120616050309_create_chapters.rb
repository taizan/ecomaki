class CreateChapters < ActiveRecord::Migration
  def change
    create_table :chapters do |t|
      t.integer :novel_id
      t.string :name
      t.integer :no

      t.timestamps
    end
  end
end
