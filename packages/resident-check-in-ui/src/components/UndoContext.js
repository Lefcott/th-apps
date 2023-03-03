import React, { useState, createContext, useContext } from 'react'

export const UndoContext = createContext({})

export function UndoProvider(props) {
  // keep track of the undone alert here, as a way to populate form data
  const [undoAlert, setUndoAlert] = useState({})

  const context = { undoAlert, setUndoAlert };

  return <UndoContext.Provider value={context} {...props}>{props.children}</UndoContext.Provider>
}

export const useUndoContext = () => useContext(UndoContext);
