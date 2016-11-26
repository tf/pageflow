module Pageflow
  class HostedFileUrlTemplates < FileUrlTemplates
    def call
      variants.each_with_object({}) do |(name, attachment), result|
        result[name] = url_template(example_file_url(attachment))
      end
    end

    protected

    def example_file_model
      throw NotImplementedError
    end

    def example_file_extension
      throw NotImplementedError
    end

    def variants
      {original: :attachment_on_s3}
    end

    private

    def example_file_url(attachment)
      if attachment.is_a?(Array)
        example_file.send(attachment.first).url(attachment.last)
      else
        example_file.send(attachment).url
      end
    end

    def example_file
      example_file_model.new(id: 0,
                             attachment_on_s3_file_name: [
                               ':basename',
                               example_file_extension
                             ].join('.'))
    end
  end
end
