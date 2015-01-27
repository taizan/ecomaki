class ApplicationController < ActionController::Base
  protect_from_forgery
 
  before_filter :set_locale
  before_filter :set_access

  def default_url_options(options={})
    { :locale => I18n.locale }
  end
  
  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def set_access
    headers["Access-Control-Allow-Origin"] = "*"
    headers["Access-Control-Allow-Methods"] = "GET"
  end

  # update top cache
  def update_caches
    cache_expire = 1.day
    novels = Novel.order("created_at DESC").where("status = ?", "publish").limit(10)
    Rails.cache.write("novels_new_list", novels, expires_in: cache_expire)

    novels_all = Novel.all
    Rails.cache.write("novels_all", novels_all, expires_in: cache_expire)

    entries = []
    novels.each {|novel|
      options = {:include => [:entry_balloon, :entry_character]}
      #全部とってパフォーマンス的に大丈夫か?
      entry = Entry.joins(:chapter).where("novel_id = ?", novel.id).order("chapters.order_number, entries.order_number")#.limit(4)
      entries << entry.to_json(options)
    }
    entries ="[#{entries.join(",")}]"
    Rails.cache.write("entries_new_list", entries, expires_in: cache_expire)

    layouts = Layout.all
    Rails.cache.write("layout_all", layouts, expires_in: cache_expire)

  end

  # update image list cache
  def update_image_cache
    obj = CharacterImage.all
    Rails.cache.write("images_all", obj, expires_in: 1.day)
  end

end
