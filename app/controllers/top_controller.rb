class TopController < ApplicationController
  def index
    @novels = Novel.all
  end
  def about
  end
end
