class TopController < ApplicationController
  def index
    @novels = Novel.all
  end
end
