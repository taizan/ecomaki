
class NovelController < ApplicationController
  def show
  end

  def show_novel_xml
    novel = Novel.includes(:author).find(params[:id])
    render :xml => novel.to_xml(:include => [:author, :chapter => {:include => [:entry => {:include => [:entry_balloon, :entry_character]}]}])
  end
end
