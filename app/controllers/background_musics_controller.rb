class BackgroundMusicsController < ApplicationController
  def index
    musics = BackgroundMusics.all
    respond_to do |format|
      format.xml { render :xml => musics }
      format.json { render :json => musics }
    end
  end

  def create
    music = params[:music]
    content_type = music.content_type.chomp

    # Check if the uploaded file is allowed.
    unless ["audio/mp3"].include?(content_type)
      render :text => "The uploaded type '#{content_type}' is not allowed", :status => 500
    else
      
      
      background_music = BackgroundMusic.new(:name => params[:name], :music => music.read, :content_type => content_type)
      background_music.save
      
      render :text => "OK"
    end
  end

  def show_music
    id = params[:id]
    music = BackgroundMusics.find(id)
    send_data(music.music, :disposition => "inline", :type => music.content_type)
  end
end
