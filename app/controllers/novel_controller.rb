class NovelController < ApplicationController
  before_filter :require_novel, :only => %w[show update]

  def show
    hash = {
      :include => [
        :author,
        :chapter => {
          :include => [
            :entry => {
              :include => [
                :entry_balloon,
                :entry_character,
              ],
              :methods => :canvas,
            },
          ],
        },
      ],
    }
    respond_to do |format|
      format.html { }
      format.json { render :json => @novel.to_json(hash) }
      format.xml { render :xml => @novel.to_xml(hash) }
    end
  end

  def update
    @novel.update_attributes!(params[:novel])
    respond_to do |format|
      format.json { render :json => @novel }
    end
  end

  def create
    @novel = Novel.create(params[:novel])
    redirect_to :action => :show, :id => @novel.id
  end

  private

  def require_novel
    @novel = Novel.find(params[:id]) or redirect_to root_path
  end
end
