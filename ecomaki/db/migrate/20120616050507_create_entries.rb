class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.integer :parent_entry_id
      t.integer :author
      t.integer :width
      t.integer :height
      t.string :type

      t.timestamps
    end
  end
end
