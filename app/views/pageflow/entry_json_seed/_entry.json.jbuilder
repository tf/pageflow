json.merge! common_entry_seed(entry)

json.theming entry_theming_seed(entry)

json.storyline_configurations entry_storyline_configurations_seed(entry)
json.chapters entry_chapters_seed(entry)
json.pages entry_pages_seed(entry)

json.file_ids entry_file_ids_seed(entry)

json.files do
  Pageflow.config.file_types.each do |file_type|
    json.set!(file_type.collection_name) do
      json.array!(entry.files(file_type.model)) do |file|
        json.partial! 'pageflow/entry_json_seed/file', file: file, file_type: file_type
      end
    end
  end
end
