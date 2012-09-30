class EntryCharactersController < ApplicationController
  def index
    entry_id = params[:entry_id]
    characters = EntryCharacter.where("entry_id = ?", entry_id)
    respond_to {|format|
      format.json { render :json => characters }
    }
  end

  def show
    character = EntryCharacter.find(params[:id])
    respond_to {|format|
      format.json { render :json => character }
    }
  end

  def update
    character = EntryCharacter.find(params[:id])
    character.update_attributes!(params[:entry_character])

    respond_to do |format|
      format.json { render :json => character }
    end
  end

  def create
    character = EntryCharacter.new(params[:entry_character])
    character.save

    respond_to do |format|
      format.json { render :json => character }
    end
  end

  def destroy
    character = EntryCharacter.find(params[:id])
    character.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end
end
