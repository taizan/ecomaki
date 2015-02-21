class TopController < ApplicationController
  def index
    cache_expire = 1.day
    Novel.class
    Entry.class

    #キャッシュを作る
    @novels = Rails.cache.fetch( "novels_new_list", expires_in: cache_expire) do
      # Get the latest 10 novels.
      Novel.order("created_at DESC").where("status = ?", "publish").limit(10)
    end
    
    @entries = 
    Rails.cache.fetch( "entries_new_list", expires_in: cache_expire) do
      entries = []
      @novels.each {|novel|
        options = {:include => [:entry_balloon, :entry_character]}
        #全部とってパフォーマンス的に大丈夫か?
        entry = Entry.joins(:chapter).where("novel_id = ?", novel.id).order("chapters.order_number, entries.order_number")#.limit(4)
        entries  << entry.to_json(options)

      }
      "[#{entries.join(",")}]"
    end

    Layout.class
    @layouts = Rails.cache.fetch( "layouts_all", expires_in: cache_expire) do
      Layout.all
    end

  end

  def all
    cache_expire = 1.day
    Novel.class
    Layout.class

    @novels = Rails.cache.fetch( "novelss_all", expires_in: cache_expire) do
      Novel.all
    end

    @layouts = Rails.cache.fetch( "layouts_all", expires_in: cache_expire) do
      Layout.all
    end
  end

  def about
  end


  def update_all_caches
     update_caches
  end
end
