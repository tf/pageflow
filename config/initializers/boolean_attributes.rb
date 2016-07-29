# add any other boolean attributes to the %w() below to make them work like checked.
BOOLEAN_ATTRIBUTES = %w(default).to_set
BOOLEAN_ATTRIBUTES.merge(BOOLEAN_ATTRIBUTES.map(&:to_sym))
ActionView::Helpers::TagHelper::BOOLEAN_ATTRIBUTES.merge(BOOLEAN_ATTRIBUTES)
