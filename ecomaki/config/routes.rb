Ecomaki::Application.routes.draw do
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'

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
