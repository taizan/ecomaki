class NovelController < ApplicationController
  def show
    novel = Novel.includes(:author).find(params[:id])
    respond_to {|format|
      format.html { }
      format.xml { render :xml => novel.to_xml(:include => [:author, :chapter => {:include => 
              [:entry => {:include => [:entry_balloon, :entry_character], :methods => :canvas}]
            }]) }
      format.json { render :json => novel.to_json(:include => [:author, :chapter => {:include =>
              [:entry => {:include => [:entry_balloon, :entry_character], :methods => :canvas}]
            }]) }
    }
  end

  def update
    novel = Novel.find(params[:id])

    novel.update_attributes!(params[:novel])

    respond_to do |format|
      format.json { render :json => novel }
    end
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
