class NovelsController < ApplicationController
  before_filter :require_novel, :only => [:show, :update, :edit]

  def show
    options = {
      :except => [:password],
      :include => [
        :author,
        :chapter => {
          :include => [:entry => {:include => [:entry_balloon, :entry_character], :methods => :canvas}]
        },
      ]
    }
    respond_to do |format|
      format.html { }
      format.json { render :json => @novel.to_json(options) }
      format.xml { render :xml => @novel.to_xml(options) }
    end
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
          render
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

  def create
    # Generate random string
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    password = Array.new(16) { charset[rand(charset.size)] }.join

    # Set as an initial password.
    params[:novel] ||= {}
    params[:novel][:password] = password

    # Create on DB.
    @novel = Novel.create(params[:novel])
    redirect_to :action => :edit, :id => @novel.id, :password => @novel.password
  end

  private

  def require_novel
    @novel = Novel.find(params[:id]) or redirect_to root_path
  end
end
