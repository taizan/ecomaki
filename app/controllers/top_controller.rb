class TopController < ApplicationController
  def index
    # Get the latest 10 novels.
    @novels = Novel.order("created_at DESC").where("status = ?", "publish").limit(10)
    entries = []
    
    @novels.each {|novel|
      options = {:include => [:entry_balloon, :entry_character]}
      entry = Entry.joins(:chapter).where("novel_id = ?", novel.id).order("chapters.order_number, entries.order_number").limit(4)
      entries << entry.to_json(options)
    }
    @entries = "[#{entries.join(",")}]"
    @layouts = Layout.all
  end
  def all
    @novels = Novel.all
    @layouts = Layout.all
  end
  def about
  end
end
