
class NovelController < ApplicationController
  def show
    novel = Novel.includes(:author).find(params[:id])
    respond_to {|format|
      format.html { }
      format.xml { render :xml => novel.to_xml(:include => [:author, :chapter => {:include => [:entry => {:include => [:entry_balloon, :entry_character]}]}]) }
      format.json { render :json => novel.to_json(:include => [:author, :chapter => {:include => [:entry => {:include => [:entry_balloon, :entry_character]}]}]) }
    }
    #render novel
  end

  def show_novel_xml
    novel = Novel.includes(:author).find(params[:id])
    render :xml => novel.to_xml(:include => [:author, :chapter => {:include => [:entry => {:include => [:entry_balloon, :entry_character]}]}])
  end

  def update_entry
  end
  
  def create_entry
  end

  def create_chapter
  end

  def update_chapter
  end

  def create
  end
end
