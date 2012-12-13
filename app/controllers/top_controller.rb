class TopController < ApplicationController
  def index
    @novels = Novel.all
    @layouts = Layout.all
  end
  def about
  end
end
