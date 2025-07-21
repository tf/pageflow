#!/bin/bash

set -ex
echo "Test 1"
sudo add-apt-repository -y ppa:chris-needham/ppa
sudo apt-get update
sudo apt-get install -y build-essential libssl-dev libreadline-dev zlib1g-dev \
                        libsqlite3-dev git curl libyaml-dev libgmp-dev autoconf \
                        bison libffi-dev libgdbm-dev \
                        mariadb-server libvips42 imagemagick audiowaveform

sudo service mariadb start
mariadb --version

git clone https://github.com/rbenv/rbenv.git ~/.rbenv

rbenv init - bash
echo 'eval "$(rbenv init - bash)"' >> ~/.bashrc
source ~/.bashrc
cat ~/.bashrc

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build

ls ~/.rbenv/bin
echo $PATH
which rbenv

rbenv install 3.2.3
rbenv global 3.2.3

ruby -v
which ruby

bundle install
npm install -g yarn@1.22.5 --force
yarn install
yarn build

bin/rspec spec/models/pageflow/account_spec.rb
