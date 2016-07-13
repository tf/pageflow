module Pageflow
  module OutputSource
    STATE_MAPPING = {
      true => 'finished',
      false => 'skipped'
    }

    extend ActiveSupport::Concern

    included do
      serialize :outputs_definition, JSON
    end

    def outputs_present
      present_outputs_label_state_array = outputs_definition.select do |output_label, _output_state|
        output_present?(output_label) == true
      end

      present_outputs_label_state_array.map { |output_label_state| output_label_state[0].to_sym }
    end

    def output_present?(type)
      outputs_definition[type]
    end

    def outputs_presences=(presences)
      boolean_presences = presences.each_with_object({}) do |(key, value), result|
        if value == true || value == STATE_MAPPING[true]
          result[key] = true
        elsif value == false || value == STATE_MAPPING[false]
          result[key] = false
        elsif value.blank?
          result[key] = nil
        end
      end

      self.outputs_definition = outputs_definition
                                .merge(boolean_presences)
                                .reject { |_key, value| value.nil? }
    end

    def outputs_definition
      super || {}
    end
  end
end
