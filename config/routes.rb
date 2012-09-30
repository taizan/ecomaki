Ecomaki::Application.routes.draw do
  root :to => 'top#index'

  # Balloons
  match 'novel/:novel_id/chapters/:chapter_id/entries/:entry_id/balloons' => 'entry_balloons#index', :via => :get, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries/:entry_id/balloons/:id' => 'entry_balloons#show', :via => :get, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries/:entry_id/balloons/:id' => 'entry_balloons#update', :via => :put, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries/:entry_id/balloons' => 'entry_balloons#create', :via => :post, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries/:entry_id/balloons/:id' => 'entry_balloons#destroy', :via => :delete, :format => :json

  # Characters
  match 'novel/:novel_id/chapters/:chapter_id/entries/:entry_id/characters' => 'entry_characters#index', :via => :get, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries/:entry_id/characters/:id' => 'entry_characters#show', :via => :get, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries/:entry_id/characters/:id' => 'entry_characters#update', :via => :put, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries/:entry_id/characters' => 'entry_characters#create', :via => :post, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries/:entry_id/characters/:id' => 'entry_characters#destroy', :via => :delete, :format => :json

  # Entries
  match 'novel/:novel_id/chapters/:chapter_id/entries' => 'entries#index', :via => :get, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries/:id' => 'entries#show', :via => :get, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries/:id' => 'entries#update', :via => :put, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries' => 'entries#create', :via => :post, :format => :json
  match 'novel/:novel_id/chapters/:chapter_id/entries/:id' => 'entries#destroy', :via => :delete, :format => :json

  # Chapters
  match 'novel/:novel_id/chapters' => 'chapters#index', :via => :get, :format => :json
  match 'novel/:novel_id/chapters/:id' => 'chapters#show', :via => :get, :format => :json
  match 'novel/:novel_id/chapters/:id' => 'chapters#update', :via => :put, :format => :json
  match 'novel/:novel_id/chapters' => 'chapters#create', :via => :post, :format => :json
  match 'novel/:novel_id/chapters/:id' => 'chapters#destroy', :via => :delete, :format => :json

  # Novels
  match 'novel/:id' => 'novel#update', :via => :put
  match 'novel/:id' => 'novel#show', :via => :get

  # Characters
  match 'characters' => 'characters#index', :via => :get
  match 'characters' => 'characters#create', :via => :post
  match 'characters/image/:id' => 'characters#show_image'
end
