class CharactersController < ApplicationController
  def index
    characters = Character.all
    respond_to do |format|
      format.xml { render :xml => characters }
    end
  end

  def create
    character = Character.new(params)
    character.save

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
