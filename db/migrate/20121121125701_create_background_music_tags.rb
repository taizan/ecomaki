class CreateBackgroundMusicTags < ActiveRecord::Migration
  def change
    create_table :background_music_tags do |t|
      t.integer :background_music_id
      t.integer :background_music_tag_name_id

      t.timestamps
    end
  end
end
