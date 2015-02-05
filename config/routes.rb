Ecomaki::Application.routes.draw do
  root :to => 'top#index'
  match 'all' => 'top#all'
  match 'about' => 'top#about'

  match 'update' => 'top#update_all_caches'

  match 'tweet' => 'tweet#post'

  # Tutorial
  match 'tutorial' => 'tutorial#index'
  match 'tutorial/index' => 'tutorial#index'
  match 'tutorial/new_index' => 'tutorial#new_index'
  match 'tutorial/node1' => 'tutorial#node1'
  match 'tutorial/node2' => 'tutorial#node2'
  match 'tutorial/node3' => 'tutorial#node3'
  match 'tutorial/node4' => 'tutorial#node4'
  match 'tutorial/node5' => 'tutorial#node5'
  match 'tutorial/node6' => 'tutorial#node6'
  match 'tutorial/node7' => 'tutorial#node7'
  match 'tutorial/node8' => 'tutorial#node8'
  match 'tutorial/node9' => 'tutorial#node9'
  match 'tutorial/node10' => 'tutorial#node10'
  match 'tutorial/node11' => 'tutorial#node11'
	
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
  match 'caches/:id' => 'novels#get_cache', :via => :get 
  match 'caches/:id' => 'novels#up_cache', :via => :post

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

  # Maker mode
  match 'maker/:id' => 'novels#maker', :via => :get

  # Maker dup
  match 'novels/:id/dup_as_maker' => 'novels#novel_dup_as_maker'
  
  match 'novels/:id/dup_no_redirect' => 'novels#novel_dup_no_redirect'

  # Layout Data
  match 'layouts' => 'layouts#index', :via => :get

  # extern
  get "extern/show_temp"

  match 'img' => 'assets/img'
end
