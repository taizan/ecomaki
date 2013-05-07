class ApplicationController < ActionController::Base
  protect_from_forgery
 
  before_filter :set_locale
  def default_url_options(options={})
    { :locale => I18n.locale }
  end
  
  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

end
