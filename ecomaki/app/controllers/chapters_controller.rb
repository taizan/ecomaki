class ChaptersController < ApplicationController
  def index
    novel_id = params[:novel_id]
    chapters = Chapter.where("novel_id = ?", novel_id)
    respond_to do |format|
      format.xml { render :xml => chapters }
    end
  end
  def show
    novel_id = params[:novel_id]
    id = params[:id]
    chapter = Chapter.find(id)

    respond_to do |format|
      format.html
      format.xml { render :xml => chapter }
    end
  end
end
