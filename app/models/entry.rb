class Entry < ActiveRecord::Base
  attr_accessor :canvas
  attr_accessible :chapter_id, :width, :height,:margin_top,:margin_left,:margin_bottom, :margin_right,:order_number, :canvas, :canvas_index, :option

  belongs_to :chapter

  has_many :entry_character
  has_many :entry_balloon
  after_save :save_canvas

  def save_canvas
    File.open(data, 'wb') do |file|
      file.write(@canvas)
    end
  end

  def canvas
    data.binread rescue nil
  end

  def as_json(options = {})
    options[:methods] ||= []
    options[:methods] << :canvas
    super
  end

  private

  def data
    Rails.root.join("data/images/entry_canvas/#{id}")
  end
end
