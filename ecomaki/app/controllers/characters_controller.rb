
class CharactersController < ApplicationController
  def index
    characters = Character.all
    respond_to do |format|
      format.xml { render :xml => characters }
    end
  end
end
