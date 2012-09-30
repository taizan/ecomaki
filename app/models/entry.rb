class Entry < ActiveRecord::Base
  attr_accessor :canvas
  attr_accessible :chapter_id, :width, :height, :order_number, :canvas, :canvas_index

  belongs_to :chapter

  has_many :entry_character
  has_many :entry_balloon
  after_save :save_canvas

  def save_canvas
    File.open(canvas_filename, 'wb') do |file|
      file.write(@canvas)
    end
  end

  def canvas
    data.binread rescue nil
  end

  def as_json(options = nil)
    options ||= {}
    options[:methods] = ((options[:methods] || []) + [:canvas])
    super options
  end

  private

  def data
    Rails.root.join("data/images/entry_canvas/#{id}")
  end
end
