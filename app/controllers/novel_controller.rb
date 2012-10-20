class NovelController < ApplicationController
  before_filter :require_novel, :only => [:show, :update, :edit]

  def show
    hash = {
      :include => [
        :author,
        :chapter => {
          :include => [
            :entry => {
              :include => [
                :entry_balloon,
                :entry_character,
              ],
              :methods => :canvas,
            },
          ],
        },
      ],
    }
    respond_to do |format|
      format.html { }
      format.json { render :json => @novel.to_json(hash) }
      format.xml { render :xml => @novel.to_xml(hash) }
    end
  end

  def update
    @novel.update_attributes!(params[:novel])
    respond_to do |format|
      format.json { render :json => @novel }
    end
  end

  def edit
    # Check the given password.
    if (@novel.password != params[:password])
      flash[:error] = "The required URL is invalid."
      redirect_to :action => "show", :id => params[:id]
    else
      respond_to do |format|
        format.html
      end
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
