import React from 'react';
import ReactDOM from 'react-dom';

import AppHeader from './navigation/AppHeader';
import Entry from './Entry';

import './global.module.css';
import {EntryStateProvider} from '../entryState';
import {EditorStateProvider} from './EditorState';

const editMode = window.location.pathname.indexOf('/editor/entries') === 0;

export default function Root() {
  return (
    <>
    <EditorStateProvider active={editMode}>
      <EntryStateProvider seed={window.pageflowScrolledSeed}>
        <AppHeader />
        <Entry />
      </EntryStateProvider>
    </EditorStateProvider>
    </>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
