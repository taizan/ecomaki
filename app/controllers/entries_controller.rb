class EntriesController < ApplicationController
  def index
    chapter_id = params[:chapter_id]
    entries = Entry.joins(:chapter => :novel).select("entries.id, chapter_id, novel_id, height, width").where("chapters.id = ?", chapter_id)
    respond_to {|format|
      format.json { render :json => entries }
    }
  end

  def update
    entry = Entry.find(params[:id])
    entry.update_attributes!(params[:entry])

    respond_to {|format|
      format.json { render :json => entry }
    }
  end

  def show
    entry_id = params[:id]
    entry = Entry.joins({:chapter => :novel}).includes(:entry_character, :entry_balloon).select("entries.id, chapter_id, novel_id, entries.height, entries.width, entry_characters.height").find(entry_id)

    respond_to {|format|
      format.json { render :json => entry }
    }
  end

  def create
    entry = Entry.new(params[:entry])
    entry.save

    respond_to do |format|
      format.json { render :json => entry }
    end
  end

  def destroy
    entry = Entry.find(params[:id])
    entry.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end
end
