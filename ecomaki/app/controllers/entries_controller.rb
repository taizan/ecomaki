
class EntriesController < ApplicationController
  def index
    chapter_id = params[:chapter_id]
    entries = Entry.joins(:chapter).where("chapters.id = ?", chapter_id)
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
end
