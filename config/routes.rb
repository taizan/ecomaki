Ecomaki::Application.routes.draw do
  root :to => 'top#index'
  match 'about' => 'top#about'

  # Balloons
  match 'novels/:novel_id/chapters/:chapter_id/entries/:entry_id/balloons' => 'entry_balloons#index', :via => :get
  match 'novels/:novel_id/chapters/:chapter_id/entries/:entry_id/balloons/:id' => 'entry_balloons#show', :via => :get
  match 'edit/:novel_id/:password/chapters/:chapter_id/entries/:entry_id/balloons' => 'entry_balloons#create', :via => :post
  match 'edit/:novel_id/:password/chapters/:chapter_id/entries/:entry_id/balloons/:id' => 'entry_balloons#update', :via => :put
  match 'edit/:novel_id/:password/chapters/:chapter_id/entries/:entry_id/balloons/:id' => 'entry_balloons#destroy', :via => :delete

  # Characters
  match 'novels/:novel_id/chapters/:chapter_id/entries/:entry_id/characters' => 'entry_characters#index', :via => :get
  match 'novels/:novel_id/chapters/:chapter_id/entries/:entry_id/characters/:id' => 'entry_characters#show', :via => :get
  match 'edit/:novel_id/:password/chapters/:chapter_id/entries/:entry_id/characters' => 'entry_characters#create', :via => :post
  match 'edit/:novel_id/:password/chapters/:chapter_id/entries/:entry_id/characters/:id' => 'entry_characters#update', :via => :put
  match 'edit/:novel_id/:password/chapters/:chapter_id/entries/:entry_id/characters/:id' => 'entry_characters#destroy', :via => :delete

  # Entries
  match 'novels/:novel_id/chapters/:chapter_id/entries' => 'entries#index', :via => :get
  match 'novels/:novel_id/chapters/:chapter_id/entries/:id' => 'entries#show', :via => :get
  match 'edit/:novel_id/:password/chapters/:chapter_id/entries' => 'entries#create', :via => :post
  match 'edit/:novel_id/:password/chapters/:chapter_id/entries/:id' => 'entries#update', :via => :put
  match 'edit/:novel_id/:password/chapters/:chapter_id/entries/:id' => 'entries#destroy', :via => :delete

  # Chapters
  match 'novels/:novel_id/chapters' => 'chapters#index', :via => :get
  match 'novels/:novel_id/chapters/:id' => 'chapters#show', :via => :get
  match 'edit/:novel_id/:password/chapters' => 'chapters#create', :via => :post
  match 'edit/:novel_id/:password/chapters/:id' => 'chapters#update', :via => :put
  match 'edit/:novel_id/:password/chapters/:id' => 'chapters#show', :via => :get
  match 'edit/:novel_id/:password/chapters/:id' => 'chapters#destroy', :via => :delete

  # Novels
  # Clone mode
  match 'novels/:id/dup' => 'novels#novel_dup', :via => :post

  match 'novels' => 'novels#index', :via => :get
  match 'novel/:id' => 'novels#show', :via => :get # Old
  match 'novels/:id' => 'novels#show', :via => :get
  match 'novel' => 'novels#create', :via => :post # Old
  match 'novels' => 'novels#create', :via => :post 
  match 'edit/:id/:password' => 'novels#edit', :via => :get
  match 'edit/:id/:password' => 'novels#update', :via => :put
  match 'edit/:id/:password' => 'novels#destroy', :via => :delete

  # Characters
  match 'characters' => 'characters#index', :via => :get
  match 'characters/images' => 'character_images#index', :via => :get
  match 'characters/images' => 'character_images#create', :via => :post
  match 'characters/:id' => 'characters#show', :via => :get
  match 'characters' => 'characters#create', :via => :post
  match 'characters/:character_id/images' => 'character_images#index', :via => :get
  match 'characters/:character_id/images' => 'character_images#create', :via => :post
  match 'characters/:character_id/images/:id' => 'character_images#show_image', :via => :get
  match 'characters/images/:id' => 'character_images#show_image', :via => :get

  # Musics
  match 'background_musics' => 'background_musics#index', :via => :get
  match 'background_musics' => 'background_musics#create', :via => :post
  match 'background_musics/musics/:id' => 'background_musics#show_music'
  match 'background_musics/tags' => 'background_music_tags#index', :via => :get
  match 'background_musics/tags' => 'background_music_tags#create', :via => :post

  # Background images
  match 'background_images' => 'background_images#index', :via => :get
  match 'background_images' => 'background_images#create', :via => :post
  match 'background_images/images/:id' => 'background_images#show_image'
  match 'background_images/tags' => 'background_image_tags#index', :via => :get
  match 'background_images/tags' => 'background_image_tags#create', :via => :post

  # Edit mode
  match 'edit/:id/:password' => 'novels#edit', :via => :get

end
