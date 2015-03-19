class CommentController < ApplicationController
  def create
    comment = Comment.new( novel_id: params[:id] , text: params[:text] , name: params[:name]);
    comment.save();

    redirect_to '/novels/'+params[:id]

  end  
end
