class TopController < ApplicationController
  def index
    # Get the latest 20 novels.
    @novels = Novel.order("created_at DESC").where("status = ?", "publish").limit(20)
    @layouts = Layout.all
  end
  def about
  end
end
