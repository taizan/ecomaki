
Open source web comic builder

## Install

### Install ruby via rvm

    # Fetch rvm
    curl -L get.rvm.io | bash -s stable
    # Install rvm dependency. please read `rvm requirements`
    rvm requirements
    # And then install ruby
    rvm install ruby-1.9.3-head

### Install ecomaki-dependent gems

    cd path/to/ecomaki
    # ecomaki uses imagemagick and nodejs
    # If you are using ubuntu, try this command
    sudo aptitude install libmagickwand-dev nodejs
    bundle install --path vendor/bundle
    bundle exec rake db:migrate
    bundle exec rake db:fixtures:load
    bundle exec rails server
    xdg-open http://localhost:3000/novel/1
