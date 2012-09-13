class EntriesController < ApplicationController
  def index
    chapter_id = params[:chapter_id]
    entries = Entry.joins(:chapter => :novel).select("entries.id, chapter_id, novel_id, height, width").where("chapters.id = ?", chapter_id)
    respond_to {|format|
      format.json { render :json => entries }
    }
  end

  def update
    novel_id = params[:novel_id]
    id = params[:id]
    balloons = params[:balloons]
    characters = params[:characters]
  end

  def show
    entry_id = params[:id]
    entry = Entry.joins(:chapter => :novel).select("entries.id, chapter_id, novel_id, height, width").find(entry_id)

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
