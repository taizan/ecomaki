class Entry < ActiveRecord::Base
  attr_accessor :canvas
  attr_accessor :original_id
  attr_accessible :chapter_id, :width, :height,:margin_top,:margin_left,:margin_bottom, :margin_right,:order_number, :canvas, :canvas_index, :option

  belongs_to :chapter

  has_many :entry_character
  has_many :entry_balloon
  after_save :save_canvas

  amoeba do
    include_field [:entry_character, :entry_balloon]
    customize(lambda {|original_post, new_post|
        new_post.original_id = original_post.id
      })
  end

  def save_canvas
    if @original_id
      src = Rails.root.join("data/images/entry_canvas/#{@original_id}")
      dest = Rails.root.join("data/images/entry_canvas/#{id}")
      FileUtils.cp(src, dest)
    else
      File.open(canvas_path, 'wb') do |file|
        file.write(@canvas)
      end
    end
  end

  def canvas
    canvas_path.binread rescue nil
  end

  def as_json(options = {})
    options[:methods] ||= []
    options[:methods] << :canvas
    super
  end

  private

  def canvas_path
    Rails.root.join("data/images/entry_canvas/#{id}")
  end
end
