Pageflow.config.after_configure do |config|
  VirtualAssets.register('pageflow/plugins.js', config.plugins.flat_map(&:application_javascripts))
  VirtualAssets.register('pageflow/editor/plugins.js', config.plugins.flat_map(&:editor_javascripts))
  VirtualAssets.register('pageflow/plugins.css.scss', config.plugins.flat_map(&:application_stylesheets))
  VirtualAssets.register('pageflow/editor/plugins.css.scss', config.plugins.flat_map(&:editor_stylsheets))
end
