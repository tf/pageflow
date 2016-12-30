class TestPageType < Pageflow::PageType
  name 'background_image'

  def file_types
    [
      Pageflow::BuiltInFileType.image,
      Pageflow::BuiltInFileType.audio,
      Pageflow::BuiltInFileType.video
    ]
  end

  def template_path
    File.join('test_page_types', '_background_image.html.erb')
  end
end
