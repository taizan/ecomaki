class ChaptersController < ApplicationController
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
