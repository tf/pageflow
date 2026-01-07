#!/bin/bash
set -e

# Only run in remote environments
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

echo "Setting up Pageflow development environment..."

# Install system dependencies
sudo add-apt-repository -y ppa:chris-needham/ppa
sudo apt-get update
sudo apt-get install -y mariadb-server libvips42 imagemagick audiowaveform
sudo service mariadb start
mariadb --version

# Install Ruby dependencies
bundle install

# Install Node dependencies
npm install -g yarn@1.22.5 --force
yarn install
yarn build

# Run example test to verify setup
bin/rspec spec/models/pageflow/account_spec.rb

echo "Setup complete!"
