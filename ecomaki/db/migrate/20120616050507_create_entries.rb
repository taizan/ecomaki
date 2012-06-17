class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.integer :parent_entry_id
      t.integer :author_id
      t.integer :width
      t.integer :height
      t.string :create_type

      t.timestamps
    end
  end
end
