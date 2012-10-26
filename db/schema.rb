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

ActiveRecord::Schema.define(:version => 20121026120929) do

  create_table "authors", :force => true do |t|
    t.string   "name"
    t.string   "password"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "background_images", :force => true do |t|
    t.string   "name"
    t.string   "content_type"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "background_musics", :force => true do |t|
    t.string   "name"
    t.string   "content_type"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "chapters", :force => true do |t|
    t.integer  "novel_id"
    t.integer  "background_image_id"
    t.integer  "backfounrd_music_id"
    t.string   "title"
    t.string   "description"
    t.integer  "order_number"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  create_table "characters", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.string   "content_type"
    t.string   "author"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "entries", :force => true do |t|
    t.integer  "chapter_id"
    t.integer  "width"
    t.integer  "height"
    t.integer  "margin_top"
    t.integer  "margin_left"
    t.integer  "margin_bottom"
    t.integer  "margin_right"
    t.string   "option"
    t.integer  "order_number"
    t.integer  "canvas_index"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
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
  end

  create_table "entry_characters", :force => true do |t|
    t.integer  "character_id"
    t.integer  "entry_id"
    t.integer  "top"
    t.integer  "left"
    t.integer  "width"
    t.integer  "height"
    t.integer  "angle"
    t.integer  "z_index"
    t.integer  "clip_top"
    t.integer  "clip_left"
    t.integer  "clip_bottom"
    t.integer  "clip_right"
    t.string   "option"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
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
    t.string   "author"
    t.string   "status"
    t.string   "password"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  create_table "tags", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
