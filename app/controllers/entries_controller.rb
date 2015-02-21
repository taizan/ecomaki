class EntriesController < ApplicationController
  def index
    chapter_id = params[:chapter_id]
    entries = Entry.joins(:chapter => :novel).select("entries.id, chapter_id, novel_id, height, width, margin_top, margin_left, margin_bottom, margin_right").where("chapters.id = ?", chapter_id)
    respond_to {|format|
      format.json { render :json => entries }
    }
  end

  def update
    if has_valid_password?
      entry = Entry.find(params[:id])
      entry.update_attributes!(params[:entry])
      
      respond_to {|format|
        format.json { render :json => entry }
      }
    else
      render :status => 401
    end
  end

  def show

    options = {
       :include => [:entry_balloon, :entry_character],
       :methods => :canvas
          #:include => [:entry => {:include => [:entry_balloon, :entry_character] }]
    }
         

    entry_id = params[:id]
    entry = Entry
      .joins({:chapter => :novel})
      .includes(:entry_character, :entry_balloon)
      .select("entries.id, chapter_id, novel_id, entries.height, entries.width, entries.margin_top, entries.margin_left, entries.margin_bottom, entries.margin_right")
      .find(entry_id)


    respond_to {|format|
      #format.json { render :json => @entry.to_json(options) }
      format.json { render :json => entry }
    }
  end

  def show_canvas
    id = params[:id]
    entry = Entry.find(params[:id])
    data_url = entry.canvas_data
    png      = Base64.decode64(data_url['data:image/png;base64,'.length .. -1])
    send_data( png , :disposition => 'inline', :type => "image/png")
  end


  def create
    if has_valid_password?
      entry = Entry.new(params[:entry])
      entry.save
      
      respond_to do |format|
        format.json { render :json => entry }
      end
    else
      render :status => 401
    end
  end

  def destroy
    if has_valid_password?
      entry = Entry.find(params[:id])
      entry.destroy
      
      respond_to do |format|
        format.json { head :no_content }
      end
    else
      render :status => 401
    end
  end

private
  def has_valid_password?
    password = params[:password]
    novel_id = params[:novel_id]
    novel = Novel.find(novel_id) or return false
    return novel.password == password
  end
end
