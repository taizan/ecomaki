class BackgroundImageTagsController < ApplicationController
  def index
    tags = BackgroundImageTag.all
    respond_to do |format|
      format.xml { render :xml => tags }
      format.json { render :json => tags }
    end
  end

  def create
    tag_name = BackgroundImageTagName.where(:name => params[:name]).first_or_create
    
    tag = BackgroundImageTag.new(
      :background_image_tag_name_id => tag_name.id,
      :background_image_id => params[:image_id])
    tag.save

    respond_to do |format|
      format.xml { render :xml => tag }
      format.json { render :json => tag }
    end
  end
end
