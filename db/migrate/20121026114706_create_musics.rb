class CreateMusics < ActiveRecord::Migration
  def change
    create_table :musics do |t|
      t.string :name

      t.timestamps
    end
  end
end
