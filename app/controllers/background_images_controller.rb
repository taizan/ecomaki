class BackgroundImagesController < ApplicationController
  def index
    images = BackgroundImage.all
    respond_to do |format|
      format.xml { render :xml => images }
      format.json { render :json => images }
    end
  end

  def create
    image = params[:image]
    
    background_image = BackgroundImage.new(
      :name => params[:name],
      :description => params[:description],
      :author => params[:author],
      :image => image)
    
    if background_image.valid?
      background_image.save
      render :json => background_image
    else
      render :json => background_image.errors, :status => 500
    end
  end

  def show_image
    id = params[:id]
    image = BackgroundImage.find(id)
    send_data(image.image, :disposition => 'inline', :type => image.content_type)
  end
end
