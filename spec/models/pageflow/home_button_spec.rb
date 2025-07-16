require 'spec_helper'

module Pageflow
  describe HomeButton do
    describe '#url' do
      it 'returns home_url of revision' do
        revision = build(:revision, configuration: {home_url: 'http://example.com'})
        site = create(:site)
        home_button = HomeButton.new(revision, site)

        expect(home_button.url).to eq('http://example.com')
      end

      it 'falls back to cname of site if site has home_url' do
        revision = build(:revision, configuration: {home_url: ''})
        site = create(:site,
                      cname: 'pageflow.example.com',
                      home_url: 'http://example.com')
        home_button = HomeButton.new(revision, site)

        expect(home_button.url).to eq('http://pageflow.example.com/')
      end
    end

    describe '#enabled?' do
      it 'is true if home_button is enabled, configured in revision and supported by theme' do
        pageflow_configure do |config|
          config.themes.register(:with_home_button)
        end
        revision = build(:revision,
                         configuration: {
                           home_url: 'http://example.com',
                           home_button_enabled: true
                         },
                         theme_name: 'with_home_button')
        site = create(:site)
        home_button = HomeButton.new(revision, site)

        expect(home_button).to be_enabled
      end

      it 'is true if home_button is enabled, configured in site and supported by theme' do
        pageflow_configure do |config|
          config.themes.register(:with_home_button)
        end
        revision = build(:revision,
                         configuration: {
                           home_url: '',
                           home_button_enabled: true
                         },
                         theme_name: 'with_home_button')
        site = create(:site,
                      home_url: 'http://example.com',
                      cname: 'pageflow.exmaple.com')
        home_button = HomeButton.new(revision, site)

        expect(home_button).to be_enabled
      end

      it 'is false if home_button is disabled' do
        pageflow_configure do |config|
          config.themes.register(:with_home_button)
        end
        revision = build(:revision,
                         theme_name: 'with_home_button',
                         configuration: {
                           home_url: 'http://example.com',
                           home_button_enabled: false
                         })
        site = create(:site)
        home_button = HomeButton.new(revision, site)

        expect(home_button).not_to be_enabled
      end

      it 'is false if no home_url is configured' do
        revision = build(:revision, configuration: {home_button_enabled: true})
        site = create(:site, home_url: '')
        home_button = HomeButton.new(revision, site)

        expect(home_button).not_to be_enabled
      end

      it 'is false if theme does not support home button' do
        pageflow_configure do |config|
          config.themes.register(:no_home_button, no_home_button: true)
        end
        revision = build(:revision,
                         theme_name: 'no_home_button',
                         configuration: {
                           home_url: 'http://example.com',
                           home_button_enabled: true
                         })
        site = create(:site)
        home_button = HomeButton.new(revision, site)

        expect(home_button).not_to be_enabled
      end
    end
  end
end
