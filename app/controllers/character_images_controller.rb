class CharacterImagesController < ApplicationController
  def index
    CharacterImage.class
    character_id = params[:character_id]
    images = nil
    
    if character_id
      images = CharacterImage.where("character_id = ?", character_id)
    else
      images = Rails.cache.fetch( "images_all", expires_in: 1.day) do
        images = CharacterImage.all;
      end
    end
    respond_to do |format|
      format.xml { render :xml => images }
      #format.json { render :json => images.group_by(&:character_id) }
      format.json { render :json => images }
    end
  end

  def create
    character_id = params[:character_id]

    # Find by name
    character_id = Character.where("name = ?", params[:character_name]).first.id if character_id.nil?

    # Create new character.
    if character_id.nil?
      character = Character.new(
        :name => params[:character_name],
        :description => params[:description],
        :author => params[:author])
      character.save
      character_id = character.id
    end

    image = params[:image]
    dataURL = params[:imageURL]

    if image.nil? and  dataURL.nil?
      render :text => "The uploaded type has unallowed content type 2", :status => 500
    else
      if dataURL.nil?
      
        content_type = image.content_type.chomp
        if ['image/jpeg', 'image/png', 'image/gif'].include?(content_type)
          character_image = CharacterImage.new(
            :image => image,
            :character_id => character_id,
            :author => params[:author],
            :description => params[:description])
          character_image.set_type
          character_image.save
          character_image.save_image
      
          render :json => character_image
        else
          render :text => "The uploaded type has unallowed content type 1", :status => 500
        end
      else
        image_data = Base64.decode64(dataURL['data:image/png;base64,'.length .. -1])
    
        character_image = CharacterImage.new(
          :image => image_data,
          :character_id => character_id,
          :author => params[:author],
          :description => params[:description])
        character_image.set_png_type
        character_image.save
        character_image.save_image_data

        render :json => character_image
      end
    end

    #image list のcache更新
    Thread.new do
      update_image_cache
    end
  end

  def show_image
    id = params[:id]

    image = CharacterImage.find(id)
    send_data(image.image, :disposition => 'inline', :type => image.content_type)
  end
end
