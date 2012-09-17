class Entry < ActiveRecord::Base
  attr_accessor :canvas
  attr_accessible :chapter_id, :width, :height, :order_number, :canvas

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
    content = nil

    begin
      File.open(canvas_filename, 'rb') do |file|
        content = file.read
      end
    rescue
      # do nothing.
    end

    return content
  end

  def as_json(options = nil)
    options ||= {}
    options[:methods] = ((options[:methods] || []) + [:canvas])
    super options
  end

  private

  def canvas_filename
    return RAILS_ROOT + "/data/images/entry_canvas/#{id}"
  end
end
