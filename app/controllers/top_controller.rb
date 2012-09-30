class TopController < ApplicationController
  def index
    @novel = Novel.new
  end
end
