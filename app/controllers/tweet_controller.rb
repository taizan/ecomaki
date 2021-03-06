require 'twitter'
require 'base64'

class TweetController < ApplicationController
  config_accessor :consumer_key, :consumer_secret, :access_token, :access_token_secret


  def info
    data =  self.consumer_key #+"\n"+ self.consumer_secret +"\n"+ self.access_token +"\n"+ self.access_token_secret
    render :text => data
  end

  def post
    capture

    client = get_twitter_client

    tweet = params[:text];
    res = update(client, tweet , image_path)

    url = res.media[0].media_url.to_s

    cap_image = CapturedImage.find_by_id( params[:id]) 
    if cap_image.nil?
      cap_image = CapturedImage.new(
        :id => params[:id],
        :url => url )
    else
      cap_image.url = url
    end
    cap_image.save

  end

  def async_post
    #save_image
    Thread.new do
      post
    end

    render :text => "ok"
  end

  private

  def save_image
    dataURL = params[:imageURL].gsub(/\n/, '').gsub(' ', '+')

    if dataURL.present?
      #print dataURL
      image_data = Base64.decode64(dataURL)
      File.open( image_path , 'wb') do |file|
        file.write( image_data )
      end
    end
  end

  def capture
    path = Rails.root.to_s ;
    command = "phantomjs " +path+"/script/capture.js" + " http://" + request.host+'/novels/nolayout/' + params[:id] + " " + image_path.to_s()
    #system( "echo log  > /home/taizan/ecomaki/dat2" );
    #system( "echo "+ command +" > /home/taizan/ecomaki/dat" )
    # command = 'curl http://localhost:2000/?url='+request.host+'/novels/nolayout/' + params[:id] + ' > '
    system( command  )
  end

  def get_twitter_client 
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = self.consumer_key
      config.consumer_secret     = self.consumer_secret
      config.access_token        = self.access_token
      config.access_token_secret = self.access_token_secret
    end
    client
  end
 
  def update(client, tweet, path)
    begin
      tweet = (tweet.length > 140) ? tweet[0..139].to_s : tweet
      if path != false
        client.update_with_media(tweet.chomp , open(path) )
      else
        client.update(tweet.chomp )
      end
    rescue => e
      Rails.logger.error "<<twitter.rake::tweet.update ERROR : #{e.message}>>"
    end
  end

  def image_path
    if params[:id].present?
      Rails.root.join('data', 'images', 'novel', params[:id]+".png")
    else
      false
    end
  end

end
