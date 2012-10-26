class CreateBackgroundMusics < ActiveRecord::Migration
  def change
    create_table :background_musics do |t|
      t.string :name

      t.timestamps
    end
  end
end
