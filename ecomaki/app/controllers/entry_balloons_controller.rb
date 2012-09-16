class EntryBalloonsController < ApplicationController
  def index
    entry_id = params[:entry_id]
    balloons = EntryBalloon.where("entry_id = ?", entry_id)
    respond_to {|format|
      format.json { render :json => balloons }
    }
  end

  def show
    balloon = EntryBalloon.find(params[:id])
    respond_to do |format|
      format.json { render :json => balloon }
    end
  end

  def update
    balloon = EntryBalloon.find(params[:id])
    balloon.updateAttributes!(params[:entry_balloon])

    respond_to do |format|
      format.json { render :json => balloon }
    end
  end

  def create
    balloon = EntryBalloon.new(params[:entry_balloon])
    balloon.save

    respond_to do |format|
      format.json { render :json => balloon }
    end
  end

  def destroy
    balloon = EntryBalloon.find(params[:id])
    balloon.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end
end
