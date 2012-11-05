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
    if has_valid_password?
      chapter_id = params[:id]
      chapter = Chapter.find(chapter_id)
      chapter.update_attributes!(params[:chapter])
      
      respond_to do |format|
        format.json { render :json => chapter }
      end
    else
      render :status => 401
    end
  end

  def create
    if has_valid_password?
      chapter = Chapter.new(params[:chapter])
      chapter.save
      
      respond_to do |format|
        format.json { render :json => chapter }
        format.xml { render :xml => chapter }
      end
    else
      render :status => 401
    end
  end

  def destroy
    if has_valid_password?
      chapter = Chapter.find(params[:id])
      chapter.destroy
      
      respond_to do |format|
        format.json { head :no_content }
      end
    else
      render :status => 401
    end
  end

  def has_valid_password?
    password = params[:password]
    novel_id = params[:novel_id]
    novel = Novel.find(novel_id) or return false
    return novel.password == password
  end

end
