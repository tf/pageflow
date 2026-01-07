#!/bin/bash
# Don't use set -e - we want to continue on non-critical failures

# Only run in remote environments
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

echo "Setting up Pageflow development environment..."

# Check network connectivity
check_network() {
  curl -s --connect-timeout 5 -I https://rubygems.org &>/dev/null || curl -s --connect-timeout 5 -I https://archive.ubuntu.com &>/dev/null
}

NETWORK_AVAILABLE=false
if check_network; then
  NETWORK_AVAILABLE=true
  echo "Network available"
else
  echo "Network unavailable - skipping remote package installation"
fi

# Install system dependencies (only if network available)
if [ "$NETWORK_AVAILABLE" = true ]; then
  # Try to add PPA for audiowaveform
  if command -v add-apt-repository &>/dev/null; then
    sudo add-apt-repository -y ppa:chris-needham/ppa 2>/dev/null || echo "Could not add PPA"
  fi

  sudo apt-get update || echo "apt-get update failed"
  sudo apt-get install -y mariadb-server libmariadb-dev libmariadb-dev-compat libvips42 imagemagick || echo "Some packages failed to install"
  sudo apt-get install -y audiowaveform 2>/dev/null || echo "audiowaveform not available"
fi

# Start MariaDB if installed
if command -v mariadb &>/dev/null; then
  sudo service mariadb start 2>/dev/null || echo "Could not start mariadb"
  mariadb --version
else
  echo "MariaDB not installed, skipping database setup"
fi

# Install Ruby dependencies (only if network available)
if [ "$NETWORK_AVAILABLE" = true ]; then
  echo "Installing Ruby dependencies..."
  # Fix Ruby 3.3 CGI compatibility issue
  gem install cgi 2>/dev/null || true
  gem update bundler 2>/dev/null || true
  bundle install
else
  echo "Skipping bundle install (no network)"
fi

# Install Node dependencies (only if network available)
if [ "$NETWORK_AVAILABLE" = true ]; then
  echo "Installing Node dependencies..."
  if ! command -v yarn &>/dev/null; then
    npm install -g yarn@1.22.5 --force
  fi
  yarn install
fi

# Build assets (can work offline if node_modules exists)
if [ -d "node_modules" ]; then
  echo "Building assets..."
  yarn build
else
  echo "Skipping build (node_modules not found)"
fi

# Run example test to verify setup (only if dependencies are installed)
if [ -f "Gemfile.lock" ] && bundle check &>/dev/null; then
  echo "Running verification test..."
  bin/rspec spec/models/pageflow/account_spec.rb || echo "Tests failed or could not run"
else
  echo "Skipping tests (dependencies not fully installed)"
fi

echo "Setup complete!"
