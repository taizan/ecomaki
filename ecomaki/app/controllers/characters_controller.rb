
class CharactersController < ApplicationController
  def index
    characters = Character.all
    respond_to do |format|
      format.xml { render :xml => characters }
    end
  end

  def create
    image = params[:character_image]

    character = Character.new(:name => 'test')
    character.save

    id = character.id

    File.open(RAILS_ROOT + '/public/images/characters/%d.jpg' % id, 'wb') do |file|
      file.write(image.read)
    end

    render :json => []
  end
end
