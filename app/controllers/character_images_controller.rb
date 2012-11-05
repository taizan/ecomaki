class CharacterImagesController < ApplicationController
  def index
    character_id = params[:character_id]
    images = nil
    if character_id
      images = CharacterImage.where("character_id = ?", character_id)
    else
      images = CharacterImage.all
    end
    respond_to do |format|
      format.xml { render :xml => images }
      format.json { render :json => images }
    end
  end

  def create
    character_id = params[:character_id]
    image = params[:image]
    content_type = image.content_type.chomp

    if ['image/jpeg', 'image/png'].include?(content_type)
      character_image = CharacterImage.new(
        :image => image,
        :character_id => character_id,
        :author => params[:author],
        :description => params[:description])
      character_image.save

      render :json => character_image
    else
      render :text => "The uploaded type has unallowed content type", :status => 500
    end
  end

  def show_image
    id = params[:id]

    image = CharacterImage.find(id)
    send_data(image.image, :disposition => 'inline', :type => image.content_type)
  end
end
