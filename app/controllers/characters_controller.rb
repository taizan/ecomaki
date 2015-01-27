class CharactersController < ApplicationController
  def index
    characters = Character.all
    respond_to do |format|
      format.xml { render :xml => characters }
      format.json { render :json => characters }
    end
  end

  def create
    character = Character.new(
      :name => params[:name],
      :description => params[:description],
      :author => params[:author])
    character.save

    # Register a character image if it is uploaded.
    if params.has_key?(:image)
      image = params[:image]
      content_type = image.content_type.chomp

      if ['image/jpeg', 'image/png'].include?(content_type)
        character_image = CharacterImage.new(
          :image => image,
          :character_id => character.id,
          :author => params[:author],
          :description => params[:description])
        character_image.set_type
        character_image.save
        character_image.save_image
      end
    end

    respond_to do |format|
      format.xml { render :xml => character }
    end
  end

  def show
    id = params[:id]

    character = Character.find(id)
    respond_to do |format|
      format.xml { render :xml => character }
    end
  end
end
