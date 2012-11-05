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
    content_type = image.content_type.chomp

    unless ['image/jpeg', 'image/png'].include?(content_type)
      render :text => "The uploaded type is not allowed", :status => 500
    else
      background_image = BackgroundImage.new(
        :name => params[:name],
        :description => params[:description],
        :author => params[:author],
        :image => image)
      background_image.save
      
      render :json => background_image
    end
  end

  def show_image
    id = params[:id]
    image = BackgroundImage.find(id)
    send_data(image.image, :disposition => 'inline', :type => image.content_type)
  end
end
