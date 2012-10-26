class CharactersController < ApplicationController
  def index
    characters = Character.all
    respond_to do |format|
      format.xml { render :xml => characters }
    end
  end

  def create
    image = params[:character_image]
    content_type = image.content_type.chomp

    unless ["image/jpeg", "image/png"].include?(content_type)
      render :text => "The uploaded type is not allowed", :status => 500
    else
      
      character = Character.new(:name => 'test', :content_type => content_type)
      character.save
      
      id = character.id
      
      File.open(RAILS_ROOT + '/data/images/characters/%d' % id, 'wb') do |file|
        file.write(image.read)
      end
      
      render :json => []
    end
  end

  def show_image
    id = params[:id]

    character = Character.find(id)
    filetype = character.content_type
    File.open(RAILS_ROOT + '/data/images/characters/%d' % id, 'rb') do |file|
      send_data(file.read, :disposition => "inline", :type => filetype)
    end
  end
end
