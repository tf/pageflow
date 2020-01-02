import React, {useState, useContext, useMemo, useCallback} from 'react';

const Context = React.createContext({});

export function EditorStateProvider(props) {
  const [selection, setSelectionState] = useState(null);

  const setSelection = useCallback(id => {
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'SELECT',
          payload: {id}
        },
        window.location.origin
      );
    }

    setSelectionState(id);
  }, []);

  return (
    <Context.Provider value={props.active ? {selection, setSelection} : {}}>
      {props.children}
    </Context.Provider>
  );
}

export function useEditorSelection(id) {
  const {selection, setSelection} = useContext(Context);

  return useMemo(() => (setSelection ? {
    isSelected: selection === id,
    select: () => setSelection(id),
    resetSelection: () => setSelection(null)
  } : {}), [id, selection, setSelection]);
}
