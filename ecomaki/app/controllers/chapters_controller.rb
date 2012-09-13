class ChaptersController < ApplicationController
  def index
    novel_id = params[:novel_id]
    chapters = Chapter.where("novel_id = ?", novel_id)
    respond_to do |format|
      format.xml { render :xml => chapters }
      format.json { render :json => chapters }
    end
  end

  def show
    novel_id = params[:novel_id]
    id = params[:id]
    chapter = Chapter.find(id)

    respond_to do |format|
      format.html
      format.xml { render :xml => chapter }
      format.json { render :json => chapter }
    end
  end

  def update
    chapter_id = params[:id]
    chapter = Chapter.find(chapter_id)
    chapter.update_attributes!(params[:chapter])

    respond_to do |format|
      format.json { render :json => chapter }
    end
  end

  def create
    chapter = Chapter.new(params[:chapter])
    chapter.save

    respond_to do |format|
      format.json { render :json => chapter }
    end
  end

  def destroy
    chapter = Chapter.find(params[:id])
    chapter.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end
end
