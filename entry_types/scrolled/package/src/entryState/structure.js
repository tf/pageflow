import {useMemo} from 'react';

import {useEntryState} from './EntryStateProvider';
import {getItems, getItem} from '../collections';

export function useEntryStructure() {
  const entryState = useEntryState();

  return useMemo(() => {
    const sections = [];

    const chapters = getItems(entryState.collections, 'chapters').map(chapter => ({
      permaId: chapter.permaId,
      ...chapter.configuration,
      sections: getItems(entryState.collections, 'sections')
        .filter(
          item => item.chapterId === chapter.id
        )
        .map(section => {
          const result = sectionStructure(entryState.collections, section);
          sections.push(result);
          return result;
        })
    }));

    sections.forEach((section, index) => {
      section.sectionIndex = index;
      section.previousSection = sections[index - 1];
      section.nextSection = sections[index + 1];
    });

    return chapters;
  }, [entryState]);
};

export function useSectionStructure({sectionPermaId}) {
  const entryState = useEntryState();
  const section = getItem(entryState.collections, 'sections', sectionPermaId)

  return sectionStructure(entryState.collections, section);
};

function sectionStructure(collections, section) {
  return section && {
    permaId: section.permaId,
    ...section.configuration,
    foreground: getItems(collections, 'contentElements')
      .filter(
        item => item.sectionId === section.id
      )
      .map(item => ({
        id: item.id,
        type: item.typeName,
        position: item.configuration.position,
        props: item.configuration
      }))
  };
}
