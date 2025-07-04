import {EditConfigurationView} from 'pageflow/editor';
import {EditSectionTransitionEffectView} from './EditSectionTransitionEffectView';
import {getAvailableTransitionNames} from 'pageflow-scrolled/frontend';
import {normalizeSectionConfigurationData} from '../../entryState';

export const EditSectionTransitionView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section_transition',
  hideDestroyButton: true,

  configure: function(configurationEditor) {
    const entry = this.options.entry;
    const sectionIndex = entry.sections.indexOf(this.model);
    const previousSection = entry.sections.at(sectionIndex - 1);

    const availableTransitions = getAvailableTransitionNames(
      normalizeSectionConfigurationData(this.model.configuration.attributes),
      normalizeSectionConfigurationData(previousSection.configuration.attributes)
    );

    configurationEditor.tab('transition', function() {
      this.input('transition', EditSectionTransitionEffectView, {
        defaultsModel: entry.metadata.configuration,
        defaultPropertyName: 'defaultTransition',
        optionDisabled: (value) => !availableTransitions.includes(value)
      });
    });
  }
});
