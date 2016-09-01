module Pageflow
  class TextTrackFile < ActiveRecord::Base
    include HostedFile

    def meta_data_attributes=(attributes)
      self.attributes = attributes.symbolize_keys.slice(:format,
                                                        :duration_in_ms,
                                                        :width,
                                                        :height,
                                                        :output_presences)
    end
  end
end
