class Entry < ActiveRecord::Base
  attr_accessor :canvas
  attr_accessor :original_id
  attr_accessible :chapter_id, :width, :height,:order_number, :canvas_index, :option
  attr_accessible :canvas,:background_image_id,:background_url
  attr_accessible :margin_top,:margin_left,:margin_bottom, :margin_right
  attr_accessible :character_ids 
  serialize :character_id # 配列として扱うのに必要

  belongs_to :chapter

  has_many :entry_character
  has_many :entry_balloon
  #after_save :save_canvas

  amoeba do
    include_field [:entry_character, :entry_balloon]
    customize(lambda {|original_post, new_post|
        new_post.original_id = original_post.id
      })
  end

  def save_canvas( data )
    if @original_id
      src = Rails.root.join("data/images/entry_canvas/#{@original_id}")
      dest = Rails.root.join("data/images/entry_canvas/#{id}")
      if File.exist?(src)
        FileUtils.cp(src, dest)
      else
        FileUtils.touch(dest)
      end
    else
      File.open(canvas_path, 'wb') do |file|
        file.write( data )
      end
    end
  end

  def as_json(options = {})
    options[:methods] ||= []
    options[:methods] << :canvas
    super
  end

  def canvas
    canvas_path.binread rescue  nil
  end

  def canvas_url
    "/entries/#{id}/canvas"
  end

  def canvas_path
    Rails.root.join("data/images/entry_canvas/#{id}")
  end

  def canvas_blunk
    Rails.root.join("data/images/entry_canvas/def").binread rescue  nil
  end
end
