class NovelsController < ApplicationController
  before_filter :require_novel, :only => [:update, :edit , :maker]
  #top用キャッシュの更新 updateの度に走らなくても良いか
  after_filter :update_caches_background, :only => [:update]

  def nolayout
    get_show_novel()
    render :layout => 'capture'
  end

  def show
    json_obj = get_show_novel();
    respond_to do |format|
      format.html { }
      format.json { render :json => json_obj }
    end
  end

  def get_cache
    cache_key = "novel"+params[:id];
    cache_expire = 1.year
    Novel.class 
    obj = Rails.cache.fetch(cache_key, expires_in: cache_expire) do
      get_show_novel()
    end

    render :json => obj
  end

  def up_cache
    cache_key = "novel"+params[:id]
    cache_expire = 1.year
    obj = get_show_novel()
    Rails.cache.write(cache_key, obj, expires_in: cache_expire)

    render :json => obj
  end
  
  def get_show_novel
    options = {
      :except => [:password],
      :include => [
        :author,
        :chapter => {
          :include => [:entry => {:include => [:entry_balloon, :entry_character], :methods => :canvas}]
        },
      ]
    }
     
    @novel = Novel.find(params[:id]) or redirect_to root_path
    return @novel.to_json(options)
  end

  def update
    has_valid_password = (@novel.password == params[:password])

    if has_valid_password
      @novel.update_attributes!(params[:novel])
      respond_to do |format|
        format.json { render :json => @novel }
      end
    else
      respond_to do |format|
        format.json { render :status => 401 }
      end
    end
    update_caches_background
  end

    

  def edit
    has_valid_password = (@novel.password == params[:password])

    options = {:include => [:author, :chapter => {
          :include => [:entry => {:include => [:entry_balloon, :entry_character], :methods => :canvas}]
        }
      ]
    }

    options_without_password = {:except => :password,
      :include => [:author, :chapter => {
          :include => [:entry => {:include => [:entry_balloon, :entry_character], :methods => :canvas}]
        }
      ]
    }

    respond_to do |format|
      format.html { 
        if has_valid_password
          #render
          render :layout => 'simple'
        else
          flash[:error] = "The required URL is invalid."
          redirect_to :action => "show", :id => params[:id]
        end
      }
      format.xml {
        render :xml => @novel.to_xml(has_valid_password ? options : options_without_password)
      }
      format.json {
        render :json => @novel.to_json(has_valid_password ? options : options_without_password)
      }
    end
  end

  # same as edit mode 
  def maker
    show 
  end

  def create

    # Set as an initial password.
    params[:novel] ||= {}
    params[:novel][:status] = 'initial'
    params[:novel][:password] = generate_password

    # Create on DB.
    @novel = Novel.create(params[:novel])

    #@novel.status = 'draft'
    redirect_to :action => :edit, :id => @novel.id, :password => @novel.password
  end

  def novel_dup (status = 'draft', action = :edit)
    novel = Novel.find(params[:id]) or redirect_to root_path
    new_novel = novel.dup

    new_novel.parent_novel_id = novel.id
    new_novel.status = status
    new_novel.password = generate_password
    new_novel.save

    redirect_to :action => action, :id => new_novel.id, :password => new_novel.password
  end

  # redirect to maker path and init status as maker
  def novel_dup_as_maker
    novel_dup('maker',:maker)
  end

  def novel_dup_no_redirect
    
    novel = Novel.find(params[:id]) or redirect_to root_path
    new_novel = novel.dup

    new_novel.parent_novel_id = novel.id
    new_novel.status = status
    new_novel.password = generate_password
    new_novel.save

    # render option
    options = {:include => [:author, :chapter => {
          :include => [:entry => {:include => [:entry_balloon, :entry_character], :methods => :canvas}]
        }
      ]
    }
    
    
    respond_to do |format|
      format.json { render :json => new_novel.to_json(options) }
    end
    #return new_novel
  end

  private

  def require_novel
    @novel = Novel.find(params[:id]) or redirect_to root_path
  end

  def generate_password
    # Generate random string
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    password = Array.new(16) { charset[rand(charset.size)] }.join
  end

  def update_caches_background
    Thread.new do
      update_caches
    end
  end

end
