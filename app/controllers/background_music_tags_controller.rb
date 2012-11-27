class BackgroundMusicTagsController < ApplicationController
  def index
    tags = BackgroundMusicTag.all
    respond_to do |format|
      format.xml { render :xml => tags }
      format.json { render :json => tags }
    end
  end

  def create
    tag_name = BackgroundMusicTagName.where(:name => params[:name]).first_or_create

    tag = BackgroundMusicTag.new(
      :background_music_tag_name_id => tag_name.id,
      :background_music_id => params[:music_id])
    tag.save

    respond_to do |format|
      format.xml { rendr :xml => tag }
      format.json { rendr :json => tag }
    end
  end
end
