class CreateEntryBalloons < ActiveRecord::Migration
  def change
    create_table :entry_balloons do |t|
      t.string :content
      t.integer :x
      t.integer :y
      t.integer :width
      t.integer :height

      t.timestamps
    end
  end
end
