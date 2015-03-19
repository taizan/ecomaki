class AddRotaionToEntryItems < ActiveRecord::Migration
  def change
    add_column :entry_balloons, :rotation, :integer
    rename_column :entry_characters, :angle, :rotation
  end
end
