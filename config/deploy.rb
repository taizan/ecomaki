require 'bundler/capistrano'

set :stages, %w(production staging)
set :default_stage, "staging"
require 'capistrano/ext/multistage'

set :application, "ecomaki"
set :repository,  "ssh://ecomaki@dev.ecomaki.com/home/ecomaki/git/ecomaki"
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

# db:fixtures:load
namespace :deploy do
  desc "Load fixtures"
  task :load_fixtures, :roles => :app do
    run "cd #{current_path}; rake db:fixtures:load RAILS_ENV=#{rails_env}"
  end
end
