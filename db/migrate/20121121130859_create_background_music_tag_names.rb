class CreateBackgroundMusicTagNames < ActiveRecord::Migration
  def change
    create_table :background_music_tag_names do |t|
      t.string :name
      t.timestamps
    end
  end
end
