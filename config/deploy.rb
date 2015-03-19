require 'bundler/capistrano'

set :stages, %w(production staging)
set :default_stage, "staging"
set :rails_env, :production
require 'capistrano/ext/multistage'

set :application, "ecomaki"
#set :repository,  "ssh://ecomaki@dev.ecomaki.com/home/ecomaki/git/ecomaki"
set :repository,  "git@github.com:taizan/ecomaki.git"
set :scm, :git

role :web, "dev.ecomaki.com"
role :app, "dev.ecomaki.com"
role :db,  "dev.ecomaki.com", :primary => true

set :deploy_to, "/home/ecomaki/public/ecomaki"

set :user, "ecomaki"
set :use_sudo, false

# if you want to clean up old releases on each deploy uncomment this:
# after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end

# Automatical deployment of database.yml
after 'deploy:update_code', 'deploy:symlink_db'
namespace :deploy do
  desc "Symlinks the database.yml"
  task :symlink_db, :roles => :app do
    run "ln -nfs #{deploy_to}/shared/config/database.yml #{release_path}/config/database.yml"
  end
end

# Link /data directory
after 'deploy:update_code', 'deploy:simlink_data'
namespace :deploy do
  desc "Simlinks the /data direcitory"
  task :simlink_data, :roles => :app do
    run "mv #{release_path}/data #{release_path}/data_skel"
    run "ln -nfs #{deploy_to}/shared/data #{release_path}/data"
  end
end

# db:fixtures:load
namespace :deploy do
  desc "Load fixtures"
  task :load_fixtures, :roles => :app do
    run "cd #{current_path}; rake db:fixtures:load RAILS_ENV=#{rails_env}"
  end
end


after "deploy:update_code", 'deploy:up_api_key'
namespace :deploy do
  desc "up api key"
  task :up_api_key, :roles => :app do
     run "cp #{deploy_to}/shared/config/initializers/init_twitter_api.rb #{release_path}/config/initializers/init_twitter_api.rb"
  end

end


after "deploy", "deploy:migrate"
