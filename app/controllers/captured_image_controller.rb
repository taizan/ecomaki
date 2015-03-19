class CapturedImageController < ApplicationController
  def index
    img = CapturedImage.all(:order => 'updated_at DESC')
    render :json => img 
  end

  def touch
    image = CapturedImage.find(params[:id])
    image.touch
    render :json => image
  end

  def create
    image = CapturedImage.new(
      :id => params[:id],
      :url => params[:url])
    image.save

    render :json => image 
  end

  def update
    image = CapturedImage.find(params[:id])
    if image.nil?
      image = CapturedImage.new(
        :id => params[:id],
        :url => params[:url])
    else
      image.update_attributes = { :url => params[:url] }
    end
    image.save

    render :json => image 
  end

  def show
    id = params[:id]

    image = CapturedImage.find(id)
    render :json => image 
  end
end
