import {getItem} from '../collections';

import {useEntryState} from './EntryStateProvider';
import {expandUrls} from './expandUrls';

export function useFile({collectionName, permaId}) {
  const entryState = useEntryState();

  return expandUrls(
    collectionName,
    getItem(entryState.collections, collectionName, permaId),
    entryState.config.fileUrlTemplates
  );
}
