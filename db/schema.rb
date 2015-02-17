# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20150217030104) do

  create_table "authors", :force => true do |t|
    t.string   "name"
    t.string   "password"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "background_image_tag_names", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "background_image_tags", :force => true do |t|
    t.integer  "background_image_id"
    t.integer  "background_image_tag_name_id"
    t.datetime "created_at",                   :null => false
    t.datetime "updated_at",                   :null => false
  end

  create_table "background_images", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.string   "author"
    t.integer  "width"
    t.integer  "height"
    t.string   "content_type"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "background_music_tag_names", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "background_music_tags", :force => true do |t|
    t.integer  "background_music_id"
    t.integer  "background_music_tag_name_id"
    t.datetime "created_at",                   :null => false
    t.datetime "updated_at",                   :null => false
  end

  create_table "background_musics", :force => true do |t|
    t.string   "name"
    t.string   "author"
    t.string   "description"
    t.string   "content_type"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "captured_images", :force => true do |t|
    t.string   "url"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "chapters", :force => true do |t|
    t.integer  "novel_id"
    t.integer  "background_image_id"
    t.integer  "background_music_id"
    t.string   "title"
    t.string   "description"
    t.integer  "order_number"
    t.string   "option"
    t.integer  "layout_type"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
    t.string   "background_url"
  end

  create_table "character_images", :force => true do |t|
    t.integer  "character_id"
    t.string   "author"
    t.string   "description"
    t.string   "content_type"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "characters", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.string   "author"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "entries", :force => true do |t|
    t.integer  "chapter_id"
    t.integer  "width"
    t.integer  "height"
    t.integer  "order_number"
    t.integer  "canvas_index"
    t.integer  "background_image_id"
    t.integer  "margin_top"
    t.integer  "margin_left"
    t.integer  "margin_bottom"
    t.integer  "margin_right"
    t.string   "option"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
    t.text     "character_ids"
    t.string   "background_url"
  end

  create_table "entry_balloons", :force => true do |t|
    t.integer  "entry_id"
    t.string   "content"
    t.integer  "top"
    t.integer  "left"
    t.integer  "width"
    t.integer  "height"
    t.integer  "z_index"
    t.string   "font_family"
    t.string   "font_style"
    t.string   "font_color"
    t.integer  "font_size"
    t.string   "border_style"
    t.integer  "border_width"
    t.integer  "border_radius"
    t.string   "border_color"
    t.integer  "entry_balloon_background_id"
    t.string   "background_color"
    t.string   "option"
    t.datetime "created_at",                  :null => false
    t.datetime "updated_at",                  :null => false
    t.integer  "rotation"
  end

  create_table "entry_characters", :force => true do |t|
    t.integer  "character_image_id"
    t.integer  "entry_id"
    t.integer  "top"
    t.integer  "left"
    t.integer  "width"
    t.integer  "height"
    t.integer  "rotation"
    t.integer  "z_index"
    t.integer  "refrect"
    t.integer  "clip_left"
    t.integer  "character_id"
    t.integer  "clip_right"
    t.string   "option"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
    t.string   "url"
  end

  create_table "layouts", :force => true do |t|
    t.string   "html"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "novel_histories", :force => true do |t|
    t.integer  "novel_id"
    t.integer  "author_id"
    t.string   "type"
    t.integer  "val0"
    t.integer  "val1"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "novel_tags", :force => true do |t|
    t.integer  "novel_id"
    t.integer  "tag_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "novels", :force => true do |t|
    t.integer  "author_id"
    t.integer  "parent_novel_id"
    t.string   "title"
    t.string   "description"
    t.string   "author_name"
    t.string   "status"
    t.string   "password"
    t.integer  "background_music_id"
    t.integer  "background_image_id"
    t.string   "option"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
    t.text     "character_ids"
  end

  create_table "tags", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
