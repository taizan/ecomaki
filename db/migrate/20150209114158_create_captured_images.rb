class CreateCapturedImages < ActiveRecord::Migration
  def change
    create_table :captured_images do |t|
      t.integer :id
      t.string :url

      t.timestamps
    end
  end
end
