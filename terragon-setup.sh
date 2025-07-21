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
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build

eval "$(~/.rbenv/bin/rbenv init - --no-rehash bash)"
echo $PATH

rbenv install 3.2.3
rbenv global 3.2.3

ruby -v
which ruby

bundle install
npm install -g yarn@1.22.5 --force
yarn install
yarn build
