class BackgroundMusicsController < ApplicationController
  def index
    musics = BackgroundMusic.all
    respond_to do |format|
      format.xml { render :xml => musics }
      format.json { render :json => musics }
    end
  end

  def create
    music = params[:music]
    background_music = BackgroundMusic.new(
      :name => params[:name],
      :description => params[:description],
      :author => params[:author],
      :music => params[:music])
    
    if background_music.valid?
      background_music.save
      render :json => background_music
    else
      render :text background_music.errors, :status => 500
    end
  end

  def show_music
    id = params[:id]
    music = BackgroundMusic.find(id)
    send_data(music.music, :disposition => "inline", :type => music.content_type)
  end
end
