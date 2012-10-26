class CreateEntryBalloons < ActiveRecord::Migration
  def change
    create_table :entry_balloons do |t|
      t.integer :entry_id

      # Text in the balloon.
      t.string :content

      # Size, Position
      t.integer :top
      t.integer :left
      t.integer :width
      t.integer :height
      t.integer :z_index

      # Font
      t.string :font_family
      t.string :font_style
      t.string :font_color
      t.integer :font_size

      # Border
      t.string :border_style
      t.integer :border_width
      t.integer :border_radius
      t.string :border_color

      # Background
      t.integer :entry_balloon_background_id
      t.string :background_color
      
      # Other options
      t.string :option

      t.timestamps
    end
  end
end
