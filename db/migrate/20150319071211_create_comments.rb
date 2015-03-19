class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :novel_id
      t.string :name
      t.string :text

      t.timestamps
    end
  end
end
