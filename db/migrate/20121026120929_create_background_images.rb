class CreateBackgroundImages < ActiveRecord::Migration
  def change
    create_table :background_images do |t|

      t.timestamps
    end
  end
end
